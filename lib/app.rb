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

      # Make sure the git repo is up to date before writing the file.
      system "cd #{DEST} && git pull"

      filename = write_file(filename, params[:file][:tempfile])

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
    File.read(File.join('public', 'index.html'))
  end

  def write_file(filename, tempfile)
    filename.gsub!(/\s+/, '_')
    fullpath = File.join(DEST, filename)

    dir  = File.dirname(fullpath)
    ext  = File.extname(fullpath)
    base = File.basename(fullpath, ext)
    num  = 1

    # If the file exists and is not identical, then we need to find a unique filename.
    while (File.exists?(fullpath))
      return filename if FileUtils.identical?(fullpath, tempfile.path)

      fullpath = File.join(dir, "#{base}-#{num += 1}#{ext}")
      filename = with_basename(filename, File.basename(fullpath))
    end

    FileUtils.mkdir_p(File.dirname(fullpath))
    File.open(fullpath, 'wb') do |file|
      file.write(tempfile.read)
    end

    filename
  end

  def with_basename(filename, base)
    dir = File.dirname(filename)
    dir == '.' ? base : File.join(dir, base)
  end
end
