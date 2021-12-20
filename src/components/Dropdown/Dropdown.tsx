import React from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { FaChevronDown } from 'react-icons/fa';
import { DropdownProps } from './Dropdown.types';

export const Dropdown = ({
  className,
  value,
  onChange,
  options,
}: DropdownProps): JSX.Element => (
  <Listbox
    as="div"
    className={`relative ${className}`}
    value={value}
    onChange={onChange}
  >
    {({ open }): JSX.Element => (
      <>
        <Listbox.Button
          className={`bg-white rounded flex justify-between items-center w-full h-full text-center border ${
            !open ? 'border-gray-300' : 'ring-1 ring-primary border-primary'
          } focus:outline-none`}
          type="button"
        >
          <span className="invisible pointer-events-none px-3 py-2">
            {
              options.reduce((max, current) =>
                current.label.length > max.label.length ? current : max
              ).label
            }
          </span>
          <span className="text-black font-normal px-3 py-2 absolute left-0">
            {options.find((element) => element.id === value)?.label}
          </span>
          <div className="pl-3 pr-4 py-3">
            <div
              className={`transition-transform duration-300 transform ${
                open && '-rotate-180'
              } flex-none flex justify-center items-center w-4 h-4`}
            >
              <FaChevronDown className="text-black" />
            </div>
          </div>
        </Listbox.Button>
        <Transition
          as={React.Fragment}
          show={open}
          enter="transition origin-top"
          enterFrom="transform opacity-0 scale-y-90"
          enterTo="transform opacity-100 scale-y-100"
          leave="transition origin-top"
          leaveFrom="transform opacity-100 scale-y-100"
          leaveTo="transform opacity-0 scale-y-90"
        >
          <Listbox.Options
            className="bg-white rounded mt-2 absolute w-full shadow-lg z-10 border overflow-hidden border-gray-200 py-1 focus:outline-none"
            static
          >
            {options.map(({ label, id }) => (
              <Listbox.Option
                className={({ active, selected }): string =>
                  `text-black w-full px-3 py-2 text-left focus:outline-none ${
                    active || selected
                      ? 'bg-primary border-primary text-white'
                      : ''
                  }`
                }
                key={id}
                value={id}
              >
                {label}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </>
    )}
  </Listbox>
);
