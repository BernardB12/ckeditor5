const path = require('path');
const webpack = require('webpack');
const { bundler, styles } = require('@ckeditor/ckeditor5-dev-utils');
const { CKEditorTranslationsPlugin } = require('@ckeditor/ckeditor5-dev-translations');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
	devtool: 'source-map',
	performance: { hints: false },
	entry: path.resolve(__dirname, 'src', 'ckeditor.js'),
	output: {
		library: 'ClassicEditor',
		path: path.resolve(__dirname, 'build'),
		filename: 'ckeditor.js',
		libraryTarget: 'umd',
		libraryExport: 'default'
	},
	optimization: {
		minimizer: [
			new TerserPlugin({
				sourceMap: true,
				terserOptions: {
					output: {
						comments: /^!/
					}
				},
				extractComments: false
			})
		]
	},
	plugins: [
		new CKEditorTranslationsPlugin({
			language: 'en',
			additionalLanguages: ['id']
		}),
		new webpack.BannerPlugin({
			banner: bundler.getLicenseBanner(),
			raw: true
		})
	],
	module: {
		rules: [
			{
				test: /\.svg$/,
				use: ['raw-loader']
			},
			{
				test: /\.css$/,
				use: [
					{
						loader: 'style-loader',
						options: {
							injectType: 'singletonStyleTag',
							attributes: {
								'data-cke': true
							}
						}
					},
					{
						loader: 'css-loader' // Tambahkan ini
					},
					{
						loader: 'postcss-loader',
						options: {
							postcssOptions: styles.getPostCssConfig({
								themeImporter: {
									themePath: require.resolve('@ckeditor/ckeditor5-theme-lark')
								},
								minify: true
							})
						}
					}
				]
			},
			{
				test: /\.js$/,
				exclude: /node_modules\/(?!@yayure)/,  // Proses hanya node_modules @yayure
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env']
					}
				}
			},
			{
				test: /\.(woff|woff2|ttf|eot|otf)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: '[name].[ext]',
							outputPath: 'fonts/' // Folder output untuk font
						}
					}
				],
				exclude: /node_modules\/(?!mathlive)/
			}
		]
	}
};
