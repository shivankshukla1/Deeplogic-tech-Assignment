const http = require('http')
const https = require('https')

const server = http.createServer((req, res) => {
    if (req.url === '/getTimeStories') {
        https.get('https://time.com', (response) => {
            let htmlContent = ''
            response.on('data', (block) => {
                htmlContent += block
            })

            response.on('end', () => {
              const latest6Stories = []
              const listItemStart = '<li class="latest-stories__item"'
              const listItemEnd = '</li>'

              let st = htmlContent.indexOf(listItemStart)

              while (st !== -1) {
                  const en = htmlContent.indexOf(listItemEnd, st);
                  if (en !== -1) {
                      const story = htmlContent.slice(st, en + listItemEnd.length).trim()

                      let title = "", link = "";
                      const storyTitle = story.match(/<h3 class="latest-stories__item-headline">([^<]+)<\/h3>/);
                      if(storyTitle){
                        title = storyTitle[1].trim();
                      }

                      const storyLink = story.match(/href="([^"]+)"/)
                      if(storyLink){
                        link = 'https://time.com' + storyLink[1];
                      }

                      if (title != "" && link != "") {
                        latest6Stories.push({title, link})
                      }
                      st = htmlContent.indexOf(listItemStart, en)
                  } else {
                    break
                  }
              }  
              res.writeHead(200, {'Content-Type': 'application/json'})
              res.end(JSON.stringify(latest6Stories))
            })
        })
    } else {
        res.writeHead(404);
        res.end('Not Found!!');
    }
})

server.listen(8000, () => {
    console.log("Server started at port: 8000")
})