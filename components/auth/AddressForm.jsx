import Link from "next/link"
import { useState } from "react";
const AddressForm = ({ head, type, data, setData, submitting, handleSubmit }) => {

    return (
        <section className="w-full max-w-full flex justify-center items-center drop-shadow-md">
            <form onSubmit={handleSubmit}
                className="w-full max-w-2xl flex flex-col gap-4 glassmorphism ">

      <h1 className="text-center small_head_text green_gradient">{head}</h1>

                <label >
                    <span className="font-satoshi  text-base text-[black] font-bold">
                        <span className="font-normal">Address</span></span>
                    <input value={data.address}
                        onChange={(e) => setData({
                            ...data,
                            address: e.target.value
                        })}
                        placeholder="Name eg: Premium"
                        required
                        className="input">
                    </input>
                </label>

                <label >
                    <span className="font-satoshi  text-base text-[black] font-bold">
                        <span className="font-normal">Country</span></span>
                    <input value={data.country}
                        onChange={(e) => setData({
                            ...data,
                            country: e.target.value
                        })}
                        placeholder="Name eg: Premium"
                        required
                        className="input">
                    </input>
                </label>

                <label >
                    <span className="font-satoshi  text-base text-[black] font-bold">
                        <span className="font-normal">State</span></span>

                    <input value={data.state}
                        onChange={(e) => setData({
                            ...data,
                            state: e.target.value
                        })}
                        placeholder="eg: Premium"
                        required
                        className="input">
                    </input>
                </label>

                <label >
                    <span className="font-satoshi  text-base text-[black] font-bold">
                        <span className="font-normal">District</span></span>

                    <input value={data.district}
                        onChange={(e) => setData({
                            ...data,
                            district: e.target.value
                        })}
                        placeholder="eg: Premium"
                        required
                        className="input">
                    </input>
                </label>

                <label >
                    <span className="font-satoshi  text-base text-[black] font-bold">
                        <span className="font-normal">Pin Code</span></span>

                    <input value={data.pincode}
                        onChange={(e) => setData({
                            ...data,
                            pincode: e.target.value
                        })}
                        placeholder="eg: Premium"
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

export default AddressForm

