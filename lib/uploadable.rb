require 'sinatra'

module Uploadable
  def uploader(path, opts = {})
    dest   = opts[:dest]
    secret = opts[:secret]

    post(path) do
      if params['secret'] != secret
        status 550
        "upload not permitted\n"
      else
        filename = params[:file][:filename]

        if path = params[:path]
          raise "invalid path #{path}" unless path =~ /^[\w\-\/ ]+$/
          filename = File.join(path, filename)
        end

        fullpath = File.join(dest, filename)
        FileUtils.mkdir_p(File.dirname(fullpath))

        # Make sure the git repo is up to date before writing the file.
        %x{ cd #{dest} && git pull }

        tempfile = params[:file][:tempfile]
        File.open(fullpath, 'wb') do |file|
          file.write(tempfile.read)
        end

        author = params[:author]
        raise "invalid author #{author}" unless author =~ /^[\w ]*<[\w.-@]+>$/

        %x{
          cd #{dest} &&
          git add . &&
          git commit --author='#{author}' -m 'Uploaded #{filename}' &&
          git push
        }
        filename
      end
    end
  end
end
