import Link from "next/link"
import { useState } from "react";
const Form = ({ head, type, data, setData, submitting, handleSubmit }) => {

    const [value, setValue] = useState('');

    const handleFeaturesChange = (event) => {
        const input = event.target.value;
        setValue(event.target.value);
        //first taking the input from the input and spliting them in lines
        const featuresArray = input.split('\n').map(feature => feature);;
        setData({ ...data, features: featuresArray.map(feature => feature) });
    };

//       // Function to generate line numbers
//   const generateLineNumbers = () => {
//     const lines = value.split('\n');
//     return lines.map((_, index) => <div key={index + 1} className="">{index + 1}</div>);
//   };

    return (
        <section className="w-full max-w-full flex-start flex-col drop-shadow-md">
            <form onSubmit={handleSubmit}
                className="w-full max-w-2xl flex flex-col gap-4 glassmorphism ">
      <h1 className="text-center small_head_text green_gradient">{head}</h1>

                <label >
                    <span className="font-satoshi  text-base text-[black] font-bold">
                        <span className="font-normal">Membership Name</span></span>
                    <input value={data.name}
                        onChange={(e) => setData({
                            ...data,
                            name: e.target.value
                        })}
                        placeholder="Name eg: Premium"
                        required
                        className="input">
                    </input>
                </label>

                <label >
                    <span className="font-satoshi  text-base text-[black] font-bold">
                        <span className="font-normal">Description</span></span>

                    <textarea value={data.description}
                        onChange={(e) => setData({
                            ...data,
                            description: e.target.value
                        })}
                        placeholder="eg: Premium"
                        required
                        className="form_textarea resize-none">
                    </textarea>
                </label>

                {/* Features Input */}

                <label  className="relative">
                    <span className="font-satoshi  text-base text-[black] font-bold">
                        <span className="font-normal">Features</span></span>

                        {/* <div className="absolute text-black top-8 text-sm py-3 px-1  rounded-md">{generateLineNumbers()}</div> */}
                    <textarea value={data?.features ? data.features.join('\n') : ''}
                        onChange={handleFeaturesChange}
                        placeholder="Enter plan features (one per line)"
                        required
                        className="form_textarea resize-none">
                    </textarea>
                </label>



                {/* Membership Period */}

                <label >
                    <span className="font-satoshi  text-base text-[black] font-bold">
                        <span className="font-normal">Membership Period</span></span>
                    <div className="flex gap-2">
                        {/* <input value={data.durationValue}
                            onChange={(e) => setData({
                                ...data,
                                durationValue: e.target.value
                            })}
                            type="number"
                            placeholder="eg: 28, 90"
                            required
                            className="input">
                        </input> */}
                        <select id="duration" name="duration" className="input"
                            value={data.durationUnit}
                            onChange={(e) => setData({
                                ...data,
                                durationUnit: e.target.value
                            })}
                        >
                            <option value="" disabled >Select duration</option>
                            <option value="days">Daily</option>
                            <option value="weeks">Weekly</option>
                            <option value="months">Monthly</option>
                            <option value="years">Yearly</option>
                        </select>
                    </div>

                </label>

                <label >
                    <span className="font-satoshi  text-base text-[black] font-bold">
                        <span className="font-normal">Membership Price</span></span>
                    <input value={data.price}
                        onChange={(e) => setData({
                            ...data,
                            price: e.target.value
                        })}
                        type="number"
                        placeholder="eg: 1500 INR"
                        required
                        className="input">
                    </input>
                </label>




                <div className="flex-end mx-3 mb-5 gap-4">
                    <Link href={"/admin/dashboard"} className="text-gray-500 text-sm">
                        Cancel
                    </Link>

                    <button type="submit" disabled={submitting}
                        className="px-5 py-1.5 text-sm bg-primary-orange rounded-full text-white">
                        {submitting ? `${type}...` : type}
                    </button>
                </div>
            </form>

        </section>
    )
}

export default Form

