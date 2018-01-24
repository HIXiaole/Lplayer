

const path = require("path");
const htmlWebpackPlugin = require("html-webpack-plugin");
const extractTextWebpackPlugin = require("extract-text-webpack-plugin");

const ROOT_PATH = path.resolve(__dirname);
const STATIC_PATH = path.resolve(ROOT_PATH,"./build/Lplayer/src/");
const SERVER_PATH = path.resolve(ROOT_PATH,"./build/Lplayer/src/");
const PUBLIC_PATH = path.resolve(ROOT_PATH,"./public/src/");

const config = {
	entry:{
		"lplayer":path.join(PUBLIC_PATH,"js/lplayer.js")
	},
	output:{
		path:STATIC_PATH,
		publicPath:"/",
		filename:"[name].min.js"
	},
	devServer:{
		contentBase:SERVER_PATH,
		historyApiFallback:true,
		inline:true,
		hot:true,
		port:8000
	},
	module:{
		rules:[
			{
				test:/\.css$/,
				exclude:["node_modules"],
				use:extractTextWebpackPlugin.extract({
					fallback:"style-loader",
					use:[
						{
							loader:"css-loader",
							options:{
								minimize:true
							}
						}
					]
				})
			},
			{
	　　　　　　test: /\.html$/,
	　　　　　　loader: 'html-withimg-loader'
	　　　　},
			{
				test:/\.js$/,
				exclude:["node_modules"],
				use:"babel-loader"
			},
			{
                test:/\.(jpg|jpeg|png|gif)$/,
                exclude:["node_modules"],
                use:[
                    {
                        loader:"url-loader",
                        options:{
                            limit:8192,
                            name:"img/[name]_[hash].[ext]"
                        }
                    }
                ]
            },
            {
                test:/\.(eot|svg|dtd|ttf|woff|woff2)$/,
                use:[
                    {
                        loader:"file-loader"
                    }
                ]
            }
		]
	},
	plugins:[
		new extractTextWebpackPlugin("[name].min.css"),
		new htmlWebpackPlugin({
			template:path.resolve(PUBLIC_PATH,"dome1.html"),
			filename:path.resolve(STATIC_PATH,"dome1.html"),
			inject:"head",
			minify:{
				removeComments:true,
				collapseWhitespace:true
			},
			chunks:["lplayer"]
		})
	]
}

module.exports = config;