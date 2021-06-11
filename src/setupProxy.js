const proxy = require('http-proxy-middleware')

module.exports = function(app){
	app.use(
		proxy('/api1',{ //遇见/api1前缀的请求，就会触发该代理配置
			target:'https://www.dota2.com.cn', //请求转发给谁
			changeOrigin:true,//控制服务器收到的请求头中Host的值
			pathRewrite:{'^/api1':''} //重写请求路径(必须)
		}),
        proxy('/api2',{ //遇见/api1前缀的请求，就会触发该代理配置
			target:'https://img.dota2.com.cn', //请求转发给谁
			changeOrigin:true,//控制服务器收到的请求头中Host的值
			pathRewrite:{'^/api2':''} //重写请求路径(必须)
		})
	)
}