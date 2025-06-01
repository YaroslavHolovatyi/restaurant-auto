// Import all menu images
import salad1 from './formenu/image1.jpeg';
import salad2 from './formenu/image2.jpeg';
import falafel from './formenu/image3.jpeg';
import mozzarellaFries from './formenu/image4.jpeg';
import potatoDips from './formenu/image5.jpeg';
import cheeseBath from './formenu/image6.jpeg';
import blueCheese from './formenu/image7.jpeg';
import aioliSauce from './formenu/image8.jpeg';
import srirachaSauce from './formenu/image9.jpeg';
import truffleAioli from './formenu/image10.jpeg';
import pelattiSauce from './formenu/image11.jpeg';
import bbqSauce from './formenu/image12.jpeg';
import mozzarellaBurger from './formenu/image13.jpeg';
import shrimpBurger from './formenu/image14.jpeg';
import chipotleBurger from './formenu/image15.jpeg';
import sweetPotatoFries from './formenu/image16.jpeg';
import cheeseBaconFries from './formenu/image17.jpeg';
import truffleFries from './formenu/image18.jpeg';
import mainBurger from './formenu/image19.jpeg';
import epicCheeseburger1 from './formenu/image20.jpeg';
import epicCheeseburger2 from './formenu/image21.jpeg';
import happyCowBurger from './formenu/image22.jpeg';
import sloppyJoe from './formenu/image23.jpeg';

// Create a mapping of image paths to imported images
export const menuImages: { [key: string]: string } = {
  '../assets/formenu/image1.png': salad1,
  '../assets/formenu/image2.png': salad2,
  '../assets/formenu/image3.png': falafel,
  '../assets/formenu/image4.png': mozzarellaFries,
  '../assets/formenu/image5.png': potatoDips,
  '../assets/formenu/image6.png': cheeseBath,
  '../assets/formenu/image7.png': blueCheese,
  '../assets/formenu/image8.png': aioliSauce,
  '../assets/formenu/image9.png': srirachaSauce,
  '../assets/formenu/image10.png': truffleAioli,
  '../assets/formenu/image11.png': pelattiSauce,
  '../assets/formenu/image12.png': bbqSauce,
  '../assets/formenu/image13.png': mozzarellaBurger,
  '../assets/formenu/image14.png': shrimpBurger,
  '../assets/formenu/image15.png': chipotleBurger,
  '../assets/formenu/image16.png': sweetPotatoFries,
  '../assets/formenu/image17.png': cheeseBaconFries,
  '../assets/formenu/image18.png': truffleFries,
  '../assets/formenu/image19.png': mainBurger,
  '../assets/formenu/image20.png': epicCheeseburger1,
  '../assets/formenu/image21.png': epicCheeseburger2,
  '../assets/formenu/image22.png': happyCowBurger,
  '../assets/formenu/image23.png': sloppyJoe,
};

// Helper function to get the correct image URL
export const getMenuImage = (imagePath: string): string => {
  // Convert .png to .jpeg in the path before lookup
  const jpegPath = imagePath.replace('.png', '.jpeg');
  const key = imagePath; // Keep the original key for the mapping
  return menuImages[key] || ''; // Return empty string if image not found
}; 