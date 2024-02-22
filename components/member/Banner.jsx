import React from 'react'

const Banner = () => {
  return (
    // glass_card 
    <div className="bg-gradient-to-r  rounded-md mt-6 drop-shadow-md">  
    <div className="max-w-7xl mx-auto py-3 px-4 sm:px-6 lg:px-8">
      <h1 className="head_text font-bold  mb-2 text-center blue_gradient" >Welcome to Fitness Flex</h1>
      <p className="para mb-2 mx-auto">
        "Our gym offers a wide range of classes and services to help you achieve your fitness goals. Whether you're a beginner or an experienced athlete, we have something for you!"
      </p>
      {/* <button  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
        View Classes
      </button> */}
    </div>
  </div>
  )
}

export default Banner
