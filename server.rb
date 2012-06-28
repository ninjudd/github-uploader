require 'rubygems'
require File.expand_path('../lib/uploadable', __FILE__)

class App < Sinatra::Base
  extend Uploadable
  uploader '/upload', :dest => ENV['upload_dir'], :secret => ENV['upload_secret']
end

App.set :port => ARGV[0] || 8080
App.run!

