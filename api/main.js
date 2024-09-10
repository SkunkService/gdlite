const level = require("./level");
const profile = require("./profile");

const jsonCredits = require("./credits.json");

async function credits() {
  console.log("Credits");
  console.log("-------------------------");
  
  // Display content of the JSON file
  console.log("Credits Information:", jsonCredits);
  
  // Example of how you might format the output
  jsonCredits.forEach(credit => {
    console.log(`${credit.name}: ${credit.role}`);
  });
}

async function fireEvent(type, value1, value2) {
  try {
    let result;
    switch (type) {
      case "level":
        // Call the fetchLevel or searchLevel function from level.js
        result = await level.fetchLevel(value1, value2); // Assuming value1 is the level ID and value2 some additional data.
        break;
        
      case "profile":
        // Call the fetchProfile or searchProfile function from profile.js
        result = await profile.fetchProfile(value1, value2); // Assuming value1 is the profile ID and value2 some additional data.
        break;

      default:
        console.error('Unknown type:', type);
        return null;
    }
    
    return result; // Return the result of the invoked function.
  } catch (error) {
    console.error('Error executing the event:', error);
    return null;
  }
}

module.exports = [fireEvent,credits];
