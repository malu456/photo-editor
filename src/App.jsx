import React from 'react';
import ImageCropper from './imagecropper'; // Adjust the path as per your project structure
import './App.css'; // Import your CSS file if any
const App = () => {
    return (
        <div className="App">
           
            <main>
                <ImageCropper imageUrl="https://example.com/your-image.jpg" />
                {/* Replace 'https://example.com/your-image.jpg' with your actual image URL */}
            </main>
        </div>
    );
};

export default App;
