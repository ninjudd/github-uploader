Github Upload Bookmarklet
=========================

Add file attachment capabilities to Github:issues and wikis.

# usage

    git submodule init
    git submodule update

    gem install sinatra
    gem install rack-cors

    dest=/path/to/your/repo secret=secret raw_url=http://github.com/your/repo/raw/master ruby server.rb

Then go to `localhost:8080` in your browser.
