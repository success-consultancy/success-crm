'use client';

import { DocumentText } from 'iconsax-reactjs';
import React from 'react';
import SheetWrapper from '../organisms/sheet-wrapper';
import SelectField from '../organisms/select-field';

type Props = {};

const TaskSheet = (props: Props) => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <>
      <div>
        <DocumentText onClick={() => setIsOpen(true)} className="w-5 h-5 cursor-pointer" />
      </div>
      <SheetWrapper isOpen={isOpen} setIsOpen={setIsOpen} title="Tasks" className="!w-[800px]">
        <div>
          <div></div>
          <div></div>
        </div>
      </SheetWrapper>
    </>
  );
};

export default TaskSheet;

const taskOptions = [
  { label: 'Task 1', value: 'task1' },
  { label: 'Task 2', value: 'task2' },
  { label: 'Task 3', value: 'task3' },
];
const statusOptions = [
  { label: 'Pending', value: 'pending' },
  { label: 'In Progress', value: 'in-progress' },
  { label: 'Completed', value: 'completed' },
];
