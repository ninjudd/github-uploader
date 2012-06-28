require 'sinatra'
require 'uploadable'
require 'rack/cors'

class App < Sinatra::Base
  extend Uploadable
  uploader '/upload', :dest => ENV['upload_dir'], :secret => ENV['upload_secret']

  use Rack::Cors do
    allow do
      origins '*'
      resource '/upload', :headers => :any, :methods => :post
    end
  end
end
