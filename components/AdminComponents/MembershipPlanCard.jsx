import { useState } from "react";



const MembershipPlanCard = ({ plan, handleEdit, handleDelete }) => {

  const [isChecked, setIsChecked] = useState(plan.isActive); // Initial state of checkbox
  const handleCheckboxChange = async() => {
    try {
      // Toggle isActive state locally
      setIsChecked(prevIsActive => !prevIsActive);

      const response = await fetch(`/api/admin/membership_plan/${plan._id}`,{
        method : 'PATCH',
        body : JSON.stringify({
          ...plan,
          isActive: !isChecked
        })
      })
    } catch (error) {
      console.error('Error:', error);
      // Optional: Handle error and provide feedback to the user
    }
  };

  return (
    <>
      <div className='bg-[#f4e8ff] rounded-md px-10 py-4 min-w-[500px] drop-shadow-md' >
        <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 text-center">{plan.name}</h2>
        <h2 className="font-normal text-gray-700 "><span className='font-semibold'>Description:</span> {plan.description}</h2>
        <span className='font-semibold text-gray-700'>Features:</span>

        {plan.features.map((feature, index) => {
          return <li key={index} className='text-gray-700 list-decimal'>{feature}</li>
        })}
        <div className='flex justify-between'>
          <h2 className="font-normal text-gray-700 "><span className='font-semibold'>Price:</span> {plan.price}₹</h2>
          <h2 className="font-normal text-gray-700 "><span className='font-semibold'>Duration:</span> {plan.durationValue} {plan.durationUnit}</h2>
          <h2 className="font-normal text-gray-700 flex items-center gap-2 "><span className='font-semibold'>Active:</span> <label className="switch">
            <input
            checked={isChecked}
            onChange={handleCheckboxChange}
             type="checkbox" />
            <span className="slider"></span>
          </label> </h2>
        </div>
        <h2 className="font-normal text-gray-700 "><span className='font-semibold'>Created By: </span>{plan.creator.name}</h2>

        <div className="mt-5 flex-center gap-4 border-t border-[#e7d9f5] pt-3">
          <p className="font-inter text-sm green_gradient cursor-pointer"
            onClick={() => handleEdit(plan)}>Edit</p>

          <p className="font-inter text-sm orange_gradient cursor-pointer"
            onClick={() => handleDelete(plan)}>Delete</p>
        </div>
      </div>
    </>
  )
}

export default MembershipPlanCard
