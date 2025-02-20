import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-calender-view',
  templateUrl: './calender-view.component.html',
  styleUrls: ['./calender-view.component.css']
})
export class CalenderViewComponent implements OnInit {

  @Output() currentSelectedDate = new EventEmitter<any>();
  @Input() isDisabled: boolean = false;
  currentMonth: number;
  currentYear: number;
  daysInMonth: number[];
  firstDayOfMonth: number;
  monthNames: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  yearList: number[] = [];
  currentDay: number; // Current day to highlight
  selectedDate: { day: number, month: number, year: number } | null = null; // To store the selected date

  constructor() {
    const today = new Date();
    this.currentMonth = today.getMonth();
    this.currentYear = today.getFullYear();
    this.currentDay = today.getDate();
    this.daysInMonth = [];
    this.firstDayOfMonth = new Date(this.currentYear, this.currentMonth, 1).getDay();

    // Create a list of years (you can adjust this as needed)
    let years = this.getFinancialYear();
    for (let year = years[0]; year <= years[1]; year++) {
      this.yearList.push(year);
    }
  }

  getFinancialYear(): number[] {
    const currentDate = new Date();
    let year = currentDate.getFullYear();

    // If current date is before April, it's part of the previous financial year
    if (currentDate.getMonth() < 3) { // Months are 0-indexed, so 3 = April
      year -= 1;
    }

    const startYear = year;
    const endYear = year + 1;

    return [startYear, endYear];
  }

  ngOnInit(): void {
    this.getDaysInMonth();
  }

  getDaysInMonth(): void {
    const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    this.daysInMonth = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    this.firstDayOfMonth = new Date(this.currentYear, this.currentMonth, 1).getDay();
  }

  goToNextMonth(): void {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.getDaysInMonth();
  }

  goToPreviousMonth(): void {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.getDaysInMonth();
  }

  onMonthChange(event: any): void {
    this.currentMonth = parseInt(event.target.value);
    this.getDaysInMonth();

    let currMonth = new Date().getMonth();
    let currYear = new Date().getFullYear();
    if (currMonth == this.currentMonth && currYear == this.currentYear) {
      this.isToday(new Date().getDate());
    }
  }

  onYearChange(event: any): void {
    this.currentYear = parseInt(event.target.value);
    this.getDaysInMonth();

    let currMonth = new Date().getMonth();
    let currYear = new Date().getFullYear();
    if (currMonth ==  this.currentMonth && currYear == this.currentYear) {
      this.isToday(new Date().getDate());
    }
  }

  // Helper method to check if the day is the current day
  isToday(day: number): boolean {
    return this.currentDay === day && this.currentMonth === new Date().getMonth() && this.currentYear === new Date().getFullYear();
  }

  // Method to select a date
  selectDate(day: number): void {
    this.selectedDate = {
      day,
      month: this.currentMonth,
      year: this.currentYear
    };

    this.currentSelectedDate.emit(this.selectedDate);
  }

  // Helper method to check if the date is selected
  isSelected(day: number): boolean {
    return this.selectedDate?.day === day &&
           this.selectedDate?.month === this.currentMonth &&
           this.selectedDate?.year === this.currentYear;
  }

}
