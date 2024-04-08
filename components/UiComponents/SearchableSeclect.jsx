import React, { useState, useRef, useEffect, useMemo } from "react";
import { RxCross2 } from "react-icons/rx";
import "@styles/SearchableSelect.css";
import { Input } from "@components/ui/input";
import { Badge } from "@/components/ui/badge";

const SearchableSelect = ({
  option,
  onSelect,
  submitted,
  setSubmitted,
  value,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [options, setOptions] = useState(option);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isInputFocused, setInputFocused] = useState(false);
  const [maxHeight, setMaxHeight] = useState("auto");
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    if (value) {
      setSelectedOptions(value);
      setOptions(options.filter((opt) => !value.includes(opt)));
    }
  }, []);

  useEffect(() => {
    if (submitted) {
      handleCancelAll();
      const timeout = setTimeout(() => {
        setSubmitted(false);
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [submitted]);

  useEffect(() => {
    onSelect(selectedOptions);
  }, [selectedOptions]);

  useEffect(() => {
    // Calculate the available height for the dropdown
    const availableHeight =
      window.innerHeight - dropdownRef.current.getBoundingClientRect().top - 10; // Adjust 10 if needed for spacing

    // Set the maximum height for the dropdown
    setMaxHeight(availableHeight > 0 ? `${availableHeight}px` : "auto");
  }, [isInputFocused]); // Update when input focus changes

  const handleOptionClick = useMemo(
    () => (option) => {
      setSelectedOptions([...selectedOptions, option]);
      setSearchTerm("");
      setOptions(options.filter((opt) => opt !== option));
      setInputFocused(false);
    },
    [selectedOptions]
  );

  const handleCancelClick = useMemo(
    () => (index, canceledOption) => {
      const updatedOptions = [...selectedOptions];
      updatedOptions.splice(index, 1);
      setSelectedOptions(updatedOptions);
      setOptions([...options, canceledOption]);
    },
    [selectedOptions]
  );

  const handleInputClick = (e) => {
    setInputFocused((prev) => !prev);
  };

  const handleInputBlur = () => {
    // Delay hiding options to allow clicking on them
    setTimeout(() => {
      setInputFocused(false);
    }, 150); // Adjust the delay as needed
  };

  const handleCancelAll = () => {
    setOptions([...options, ...selectedOptions]);
    setSelectedOptions([]);
    setInputFocused(false);
  };

  const handleMainDivClick = () => {
    setInputFocused(true);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center relative">
      <div
        onClick={handleMainDivClick}
        className="bg-background flex items-center border w-full rounded-md justify-start flex-wrap gap-y-1"
      >
        {selectedOptions?.map((option, index) => (
          <Badge
            key={index}
            className={"flex gap-1 justify-around rounded-sm h-8 ml-1"}
          >
            <span>{option}</span>
            <RxCross2
              className="text-white cursor-pointer hover:text-red-600"
              onClick={() => handleCancelClick(index, option)}
            />
          </Badge>
        ))}
        <Input
          type="text"
          // placeholder="Search..."
          className="outline-none border-none focus-visible:ring-0 focus-visible:border-none focus-visible:outline-none w-auto max-w-20 inline-block"
          value={searchTerm}
          onChange={handleSearchChange}
          onBlur={handleInputBlur}
          onClick={handleInputClick}
          ref={inputRef}
        />
      </div>

      <RxCross2
        className={`text-black absolute right-0 mb-2 mr-2 text-xl top-[10px] hover:text-red-500  cursor-pointer transition-all hover:block 
        ${!isInputFocused && "hidden"}`}
        onClick={handleCancelAll}
      />

      {/* Options */}
      <div
        ref={dropdownRef}
        className={`bg-primary-foreground w-full rounded-md mt-1 absolute top-10 z-50 transition-all drop-shadow-md ${
          !isInputFocused && "hidden"
        }`}
        style={{ maxHeight: maxHeight, overflowY: "auto" }}
      >
        {options
          .filter((option) =>
            option.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((option, index, array) => (
            <div
              key={option}
              className={`cursor-pointer p-2 flex justify-center items-center hover:bg-[#e8ebee] ${
                index === array.length - 1 ? "border-b-0" : "border-b"
              } `}
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </div>
          ))}
      </div>
    </div>
  );
};

export default SearchableSelect;
