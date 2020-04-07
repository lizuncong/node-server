这个项目使用node原生开发web server服务。不借助于koa或express等现有框架。
以了解node原生开发服务端的原理。

mysql可视化工具可采用Navicat或者workbench

登录校验&登录信息存储
cookie
session是种解决方案，
使用nodejs本地进程变量SESSION_DATA存储session以及使用redis存储session的利弊

nginx反向代理, nginx配置文件在/usr/local/etc/nginx/nginx.conf。
假设前端网页运行在http://localhost:8008端口下，
后端服务运行在http://localhost:8000端口下，
如果要解决跨域共享cookie的问题。可以通过nginx反向代理实现。
当访问http://localhost:8080/时转发到前端网页的端口，即8008，
当访问http://localhost:8080/api/时转发到后端服务端口，即8000。
这样就可以做到前后端同域联调
#user  lizuncong owner;
worker_processes  1;

#error_log  logs/error.log;
#error_log  logs/error.log  notice;
#error_log  logs/error.log  info;

#pid        logs/nginx.pid;


events {
    worker_connections  1024;
}


http {
    include       mime.types;
    default_type  application/octet-stream;

    #log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
    #                  '$status $body_bytes_sent "$http_referer" '
    #                  '"$http_user_agent" "$http_x_forwarded_for"';

    #access_log  logs/access.log  main;

    sendfile        on;
    #tcp_nopush     on;

    #keepalive_timeout  0;
    keepalive_timeout  65;

    #gzip  on;

    server {
        listen       8080;
        server_name  localhost;

        #location / {  #不使用默认的配置
        #    root   html;
        #    index  index.html index.htm;
        #}

        location / {
            proxy_pass  http://localhost:8008;
        }
        
        location /api/ {
            proxy_pass  http://localhost:8000;
            proxy_set_header Host $host;
        }

        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }

    }

    include servers/*;
}



日志：
关于日志的实现方面，一开始想通过在写入文件的时候，获取当前写入日志的日前，如2020-04-06，
然后以2020-04-06.log做为日志文件名，这么做的话就会频繁的创建文件。
所以还是采用定义专门的文件名比如access.log，所有的日志都写进这个文件，然后设置定时任务
每天定时从access.log文件拷贝日志，并根据日期命名拷贝文件，然后清空access.log文件，继续收集日志
使用crontab拆分日志
1.设置定时任务，格式：* * * * * command，设置每天定时执行日志拆分
2.将access.log拷贝并重命名为2020-04-06.access.log
3.清空access.log文件，继续积累日志


安全涉及的几个方面：
1.SQL注入：窃取数据库数据，可以使用mysql的escape函数预防
  以登录操作为例，如果登录的SQL这么写：
    const sql =  `select username, nickname from users where username='${username}' and password='${password}'`
    这里username是外部传入，如果恶意攻击从外面传入username: zhangsan'--。那么执行后sql就变成了下面这样
    select username, nickname from users where username='zhangsan'-- and password='123'，
    那么zhangsan后面的and password..就被注释掉了，那么即使输错密码，用户还是可以登录。
    如果username传入zhangsan';delete from users;--
    那么SQL就变成
    select username, nickname from users where username='zhangsan';delete from users;-- and password='123456'
    整个用户表就被删除了
    因此为了安全起见，要用mysql提供的escape函数转译一下username和password等外部传入的变量
2.XSS攻击：比如在前端网页新建产品时，需要输入产品名称，产品详情，如果用户在输入产品名称时，输入<script>alert(1)</script>
    如果后端拿到这个输入，不做任何转译，直接将<script>alert(1)</script>存入数据库，当前端网页再次获取产品名称时，拿到的将是
    <script>alert(1)</script>，这时候在前端页面就会执行这段js脚本，会直接弹出弹框。
    为了防止xss攻击，可以使用xss这个工具，在后端取到值时，先用xss转译一下再存入数据库
    


3.密码加密
