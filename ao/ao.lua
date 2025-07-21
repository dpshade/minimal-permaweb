local json = require("json")

-- Initialize state variables
Greetings = Greetings or {}
LastGreeting = LastGreeting or "No greetings yet"

-- Expose process state via HyperBEAM
local function exposeState()
  Send({ 
    Target = "~patch@1.0",
    device = "patch@1.0", 
    cache = { 
      greetings = Greetings,
      lastgreeting = LastGreeting,
      totalgreetings = #Greetings
    } 
  })
end

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
    
    -- Update state
    table.insert(Greetings, response)
    LastGreeting = greeting
    
    -- Expose updated state
    exposeState()
    
    Handlers.utils.reply(msg, json.encode(response))
  end
)

-- Initial state exposure
exposeState()
