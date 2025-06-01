import ImageSlider from '../components/ImageSlider/ImageSlider';
import Main from '../components/Main/Main';
import Footer from '../components/Footer/Footer';

const MainPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <ImageSlider />
      <main className="flex-1">
        <Main />
      </main>
      <Footer />
    </div>
  );
};

export default MainPage; 