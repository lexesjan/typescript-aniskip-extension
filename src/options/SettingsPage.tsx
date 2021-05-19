import React, { useEffect, useState } from 'react';
import { browser } from 'webextension-polyfill-ts';
import Dropdown from '../components/Dropdown';
import { SkipOptionType } from '../types/skip_option_type';

const SettingsPage: React.FC = () => {
  const [opOption, setOpOption] = useState<SkipOptionType>('manual-skip');
  const [edOption, setEdOption] = useState<SkipOptionType>('manual-skip');

  const handleOpeningOptionChange = (skipOption: SkipOptionType) => {
    browser.storage.sync.set({ opOption: skipOption });
    setOpOption(skipOption);
  };
  const handleEndingOptionChange = (skipOption: SkipOptionType) => {
    browser.storage.sync.set({ edOption: skipOption });
    setEdOption(skipOption);
  };

  const skipOptions = [
    {
      value: 'disabled',
      label: 'Disabled',
    },
    {
      value: 'auto-skip',
      label: 'Auto skip',
    },
    {
      value: 'manual-skip',
      label: 'Manual skip',
    },
  ];

  useEffect(() => {
    (async () => {
      const { opOption: opOptionRetrieved, edOption: edOptionRetrieved } =
        await browser.storage.sync.get({
          opOption: 'manual-skip',
          edOption: 'manual-skip',
        });
      setOpOption(opOptionRetrieved);
      setEdOption(edOptionRetrieved);
    })();
  }, [setOpOption, setEdOption]);

  return (
    <div className="sm:border sm:rounded-md border-gray-300 px-8 pt-8 pb-12 sm:bg-white">
      <h1 className="text-lg text-gray-700 uppercase font-bold mb-4">
        Settings
      </h1>
      <div className="space-y-2 w-full">
        <div className="text-xs text-gray-600 uppercase font-bold">
          Opening default action
        </div>
        <Dropdown
          className="text-sm w-full"
          value={opOption}
          onChange={handleOpeningOptionChange}
          options={skipOptions}
        />
        <div className="text-xs text-gray-600 uppercase font-bold">
          Ending default action
        </div>
        <Dropdown
          className="text-sm w-full"
          value={edOption}
          onChange={handleEndingOptionChange}
          options={skipOptions}
        />
      </div>
    </div>
  );
};

export default SettingsPage;
