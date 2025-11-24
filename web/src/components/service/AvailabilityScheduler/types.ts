export interface DaySchedule {
  active: boolean;
  start: string;
  end: string;
}

export interface Availability {
  [key: string]: DaySchedule;
}

export interface AvailabilitySchedulerProps {
  value: Availability;
  onChange: (value: Availability) => void;
}
