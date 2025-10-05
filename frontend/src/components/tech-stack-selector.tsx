import React, { useState } from 'react';
import { motion } from 'framer-motion';

// this is a mock data structure for tech stacks
// you can replace it with your actual data source or API call
const techStacks = {
  frontend: [
    { name: "React", icon: "devicon-react-original colored" },
    { name: "Next.js", icon: "devicon-nextjs-original colored" },
    // ... add more frontend technologies
  ],
  backend: [
    { name: "Node.js", icon: "devicon-nodejs-plain colored" },
    { name: "Python", icon: "devicon-python-plain colored" },
    // ... add more backend technologies
  ],
  // ... add more categories
};

interface TechStackSelectorProps {
  onStackSelect: (stacks: Array<{ name: string; icon: string }>) => void;
}

export function TechStackSelector({ onStackSelect }: TechStackSelectorProps) {
  const [selectedStacks, setSelectedStacks] = useState<Array<{ name: string; icon: string }>>([]);

  const toggleStack = (stack: { name: string; icon: string }) => {
    setSelectedStacks(prev => 
      prev.some(s => s.name === stack.name)
        ? prev.filter(s => s.name !== stack.name)
        : [...prev, stack]
    );
  };

  React.useEffect(() => {
    onStackSelect(selectedStacks);
  }, [selectedStacks, onStackSelect]);

  return (
    <div className="space-y-8">
      {Object.entries(techStacks).map(([category, stacks]) => (
        <div key={category} className="space-y-4">
          <h3 className="text-2xl font-bold text-white capitalize">{category}</h3>
          <div className="flex flex-wrap gap-4">
            {stacks.map((stack) => (
              <motion.div
                key={stack.name}
                className={`p-4 rounded-lg cursor-pointer ${
                  selectedStacks.some(s => s.name === stack.name)
                    ? 'bg-white'
                    : 'bg-gray-200 bg-opacity-20'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleStack(stack)}
              >
                <i className={`${stack.icon} text-4xl tech-icon`}></i>
                <p className="mt-2 text-center text-sm font-medium text-white">{stack.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}