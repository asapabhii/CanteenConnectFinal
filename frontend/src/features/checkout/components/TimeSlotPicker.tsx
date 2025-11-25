import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

const getNextInterval = () => {
  const now = new Date();
  const minutes = now.getMinutes();
  const remainder = minutes % 15;
  const minutesToAdd = 15 - remainder;
  const nextInterval = new Date(now.getTime() + minutesToAdd * 60000);
  nextInterval.setSeconds(0, 0);
  return nextInterval;
};

const generateTimeSlots = () => {
  const slots = [];
  const currentSlot = getNextInterval();
  for (let i = 0; i < 8; i++) { // Generate next 8 slots
    slots.push(new Date(currentSlot));
    currentSlot.setMinutes(currentSlot.getMinutes() + 15);
  }
  return slots;
};

interface TimeSlotPickerProps {
  selectedSlot: string;
  setSelectedSlot: (slot: string) => void;
}

export const TimeSlotPicker = ({ selectedSlot, setSelectedSlot }: TimeSlotPickerProps) => {
  const timeSlots = generateTimeSlots();

  return (
    <FormControl fullWidth margin="normal">
      <InputLabel id="time-slot-label">Pickup Time Slot</InputLabel>
      <Select
        labelId="time-slot-label"
        value={selectedSlot}
        label="Pickup Time Slot"
        onChange={(e) => setSelectedSlot(e.target.value)}
        required
      >
        <MenuItem value=""><em>Select a time slot</em></MenuItem>
        {timeSlots.map((slot) => (
          <MenuItem key={slot.toISOString()} value={slot.toISOString()}>
            {slot.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};