import {Component, Input, OnChanges, OnInit} from '@angular/core';
import { SchedulerEvent } from '@progress/kendo-angular-scheduler';


/* tslint:disable */

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnChanges {

  public selectedDate: Date = new Date();
  // @ts-ignore
  public events: SchedulerEvent[] ;

  // @ts-ignore
  @Input() baseData: any[];

  constructor() { }

  ngOnChanges(): void {
    const baseD = this.baseData.filter(row => row.Estado == "PENDIENTE");
    const base = baseD.map(element => {
      return {
        TaskID: element.id,
        OwnerID: 0,
        Title: element.NombrePaciente,
        Description: element.NombrePaciente,
        StartTimezone: null,
        Start: element.FechayHora,
        End: element.FinCita,
        EndTimezone: null,
        RecurrenceRule: null,
        RecurrenceID: null,
        RecurrenceException: null,
        IsAllDay: false
      };
    });
    console.log("filter:",base)
    // @ts-ignore
    this.events = base.map(dataItem => (
      // @ts-ignore
      <SchedulerEvent> {
        id: dataItem.TaskID,
        start: this.parseAdjust(dataItem.Start),
        startTimezone: dataItem.StartTimezone,
        end: this.parseAdjust(dataItem.End),
        endTimezone: dataItem.EndTimezone,
        isAllDay: dataItem.IsAllDay,
        title: dataItem.Title,
        description: dataItem.Description,
        recurrenceRule: dataItem.RecurrenceRule,
        recurrenceId: null,
        recurrenceException: dataItem.RecurrenceException,
        roomId: 0,
        ownerID: dataItem.OwnerID
      }
    ));
    console.log("events:",base)
  }

  parseAdjust(eventDate: string){
    const date = new Date(eventDate);
    const currentYear = new Date().getFullYear();
    date.setFullYear(currentYear);
    return date;
  };

}
