module.exports = {
	apps: [
		{
			name: 'helpdesk_app',
			exec_mode: 'cluster',
			instances: '1', // Or a number of instances
			script: 'node_modules/next/dist/bin/next',
			args: 'start',
		}
	]
}
