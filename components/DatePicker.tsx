'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, X } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface DatePickerProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onClose: () => void;
}

export default function DatePicker({ currentDate, onDateChange, onClose }: DatePickerProps) {
  const [selectedDate, setSelectedDate] = useState(currentDate.toISOString().split('T')[0]);

  const handleSave = () => {
    const newDate = new Date(selectedDate);
    if (newDate <= new Date()) {
      onDateChange(newDate);
      onClose();
    }
  };

  return (
    <motion.div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
      >
        <Card className="w-full max-w-sm p-6 bg-white shadow-xl rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Change Start Date</h3>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600 mb-2 block">
                When did you start your sugar-free journey?
              </label>
              <Input
                type="date"
                value={selectedDate}
                max={new Date().toISOString().split('T')[0]}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full rounded-xl border-gray-200"
              />
            </div>
            
            <div className="flex space-x-3">
              <Button 
                variant="outline"
                onClick={onClose}
                className="flex-1 rounded-xl border-gray-200"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSave}
                className="flex-1 bg-purple-500 hover:bg-purple-600 text-white rounded-xl"
              >
                Save
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}