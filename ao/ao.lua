local json = require("json")

Handlers.add(
  "Greeting",
  Handlers.utils.hasMatchingTag("Action", "Greeting"),
  function (msg)
    local sender = msg.From
    local timestamp = os.time()
    local greeting = "Hello from AO!"
    
    local response = {
      from = sender,
      timestamp = timestamp,
      greeting = greeting
    }
    
    Handlers.utils.reply(msg, json.encode(response))
  end
)
