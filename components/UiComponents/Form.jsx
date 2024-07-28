import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";

const Form = ({
  head,
  type,
  data,
  setData,
  submitting,
  handleSubmit,
  handleCancel,
  bgColor,
}) => {
  const handleFeaturesChange = (event) => {
    const input = event.target.value;
    //first taking the input from the input and splitting them in lines
    const featuresArray = input.split("\n").map((feature) => feature);
    setData({ ...data, features: featuresArray.map((feature) => feature) });
  };

  return (
    <section className="w-full max-w-full flex-start flex-col drop-shadow-md">
      <form
        onSubmit={handleSubmit}
        className={`w-full max-w-2xl flex flex-col gap-4  px-4 rounded-md ${
          bgColor ? bgColor : "bg-[rgba(105,13,197,0.103)]"
        }`}
      >
        <h1 className="text-center small_head_text green_gradient">{head}</h1>

        <Label>
          <span className="font-satoshi  text-base text-[black] font-bold">
            <span className="font-normal">Membership Name</span>
          </span>
          <Input
            value={data.name}
            onChange={(e) =>
              setData({
                ...data,
                name: e.target.value,
              })
            }
            placeholder="Name eg: Premium"
            required
            className="input"
          ></Input>
        </Label>

        <Label>
          <span className="font-satoshi  text-base text-[black] font-bold">
            <span className="font-normal">Description</span>
          </span>

          <textarea
            value={data.description}
            onChange={(e) =>
              setData({
                ...data,
                description: e.target.value,
              })
            }
            placeholder="eg: Premium"
            required
            className="form_textarea resize-none"
          ></textarea>
        </Label>

        {/* Features Input */}

        <Label className="relative">
          <span className="font-satoshi  text-base text-[black] font-bold">
            <span className="font-normal">Features</span>
          </span>

          <textarea
            value={data?.features ? data.features.join("\n") : ""}
            onChange={handleFeaturesChange}
            placeholder="Enter plan features (one per line)"
            required
            className="form_textarea resize-none"
          ></textarea>
        </Label>

        {/* Membership Period */}

        <Label>
          <span className="font-satoshi  text-base text-[black] font-bold">
            <span className="font-normal">Membership Period</span>
          </span>
          <div className="flex gap-2">
            <select
              id="duration"
              name="duration"
              className="input"
              value={data.durationUnit}
              onChange={(e) =>
                setData({
                  ...data,
                  durationUnit: e.target.value,
                })
              }
            >
              <option value="day">Daily</option>
              <option value="week">Weekly</option>
              <option value="month">Monthly</option>
              <option value="year">Yearly</option>
            </select>
          </div>
        </Label>

        <Label>
          <span className="font-satoshi  text-base text-[black] font-bold">
            <span className="font-normal">Membership Price</span>
          </span>
          <Input
            value={data.price}
            onChange={(e) =>
              setData({
                ...data,
                price: e.target.value,
              })
            }
            type="number"
            placeholder="eg: 1500 INR"
            required
            className="input"
          ></Input>
        </Label>

        <div className="flex-end mx-3 mb-5 gap-4">
          <Button
            type="button"
            onClick={handleCancel}
            className="text-gray-500 text-sm bg-transparent hover:bg-transparent "
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={submitting}
            className="text-sm bg-destructive hover:bg-destructive/80 rounded-full text-white"
          >
            {submitting ? `${type}...` : type}
          </Button>
        </div>
      </form>
    </section>
  );
};

export default Form;
