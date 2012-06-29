require 'sinatra'
require 'rack/cors'
require 'json'

class App < Sinatra::Base
  use Rack::Cors do
    allow do
      origins '*'
      resource '/upload', :headers => :any, :methods => :post
    end
  end

  DEST   = ENV['dest']
  SECRET = ENV['secret']
  URL    = ENV['raw_url']

  post '/upload' do
    if params['secret'] != SECRET
      status 550
      "upload not permitted\n"
    else
      filename = params[:file][:filename]

      if path = params[:path]
        raise "invalid path #{path}" unless path =~ /^[\w\-\/ ]+$/
        filename = File.join(path, filename)
      end

      fullpath = File.join(DEST, filename)
      FileUtils.mkdir_p(File.dirname(fullpath))

      # Make sure the git repo is up to date before writing the file.
      system "cd #{DEST} && git pull"

      tempfile = params[:file][:tempfile]
      File.open(fullpath, 'wb') do |file|
        file.write(tempfile.read)
      end

      author = params[:author]
      raise "invalid author #{author}" unless author =~ /^[\w ]*<[\w.-@]+>$/

      system %{
        cd #{DEST} &&
        git add . &&
        git commit --author='#{author}' -m 'Uploaded #{filename}' &&
        git push
      }

      JSON.generate({
        :file => filename,
        :url  => URL % filename,
        :type => params[:file][:type],
      })
    end
  end

  get '/' do
    File.read(File.join('public', 'bookmarklet', 'index.html'))
  end

end
