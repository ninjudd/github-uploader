$LOAD_PATH.unshift(File.dirname(__FILE__) + '/lib')
require 'rubygems'
require 'app'

App.set :port => ARGV[0] || 8080,
        :app_file => __FILE__,
        :static => true

App.run!

