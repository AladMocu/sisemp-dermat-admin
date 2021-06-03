import {Component, OnInit, TemplateRef} from '@angular/core';
import {DialogService} from '@fundamental-ngx/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'sisemp-admin';

  // @ts-ignore
  displayedRows: any[];

  // @ts-ignore
  appointments: any[];
  searchTerm = '';
  // @ts-ignore
  confirmationReason: string;
  // @ts-ignore
  myForm: FormGroup ;
  loading = false;
  past = false;
  // @ts-ignore
  today: Date;

  // tslint:disable-next-line:variable-name
  constructor(private _dialogService: DialogService, private _fb: FormBuilder, private _ds: DataService) {}

  ngOnInit(): void {
    this.past = true;
    this.today = new Date();
    this.appointments = [];
    this.displayedRows = this.appointments;

    this.myForm = this._fb.group({
      startInput: new FormControl(''),
      endInput: new FormControl('')
    });
    this.loading = true;
    // @ts-ignore
    this._ds.getAllApointments().subscribe((data: any[]) => {
      this.loading = false;
      this.appointments = data;
      this.cleanData();
      this.resetSearch();
    });
  }

  searchInputChanged(event: string): void {
    // @ts-ignore
    const filterRows = (row): boolean => {
      const keys = Object.keys(row);
      return !!keys.find(key => {
        if (row[key] != null){
         try {
           return row[key].toLowerCase().includes(event.toLowerCase());
         }catch (e) {
           return null;
         }
        }
        return null;
      });
    };
    if (event) {
      // @ts-ignore
      this.displayedRows = this.appointments


        .filter(row => filterRows(row));
    } else {
      this.displayedRows = this.appointments;
    }
  }

  cleanData(): void{
    this.appointments.forEach((value, index) => {
      this.appointments[index].FechayHora = new Date(value.FechayHora);
      this.appointments[index].FinCita = new Date(value.FinCita);
      this.appointments[index].cancelable = this.appointments[index].Estado === 'PENDIENTE';
      this.appointments[index].past = this.appointments[index].FechayHora < this.today;
    }, this.appointments);
    this.appointments.sort((a, b) => a.FechayHora - b.FechayHora);
  }

  obfuscatePastData(): void{
    if ( this.past ){
      this.displayedRows = this.displayedRows.filter(row => !row.past);
    }
    else {
      this.resetSearch();
    }
  }

  resetSearch(): void {
    this.displayedRows = this.appointments;
    this.searchTerm = '';
  }

  openDialog(dialog: TemplateRef<any>): void {
    const dialogRef = this._dialogService.open(dialog, { responsivePadding: true });

    dialogRef.afterClosed.subscribe(
      (result) => {
        this.confirmationReason = 'Dialog closed with result: ' + result;
        // @ts-ignore
        const tempCita = {
          // @ts-ignore
          FechayHora: this.myForm.get('startInput').value.toString(),
          // @ts-ignore
          FinCita: this.myForm.get('endInput').value.toString(),
        };
        console.log(tempCita);
        this._ds.addAppointment(tempCita).subscribe(el => console.log(el));
        // @ts-ignore
        this.myForm.setValue({startInput: '', endInput: ''});
        // @ts-ignore
        this._ds.getAllApointments().subscribe((data: any[]) => {
          this.loading = false;
          this.appointments = data;
          this.cleanData();
          this.resetSearch();
        });
      },
      (error) => {
        this.confirmationReason = 'Dialog dismissed with result: ' + error;
      }
    );
  }
  // tslint:disable-next-line:typedef
  refresh(){
    this.loading = true;
    // @ts-ignore
    this._ds.getAllApointments().subscribe((data: any[]) => {
      this.past = true;
      this.loading = false;
      this.appointments = data;
      this.cleanData();
      this.resetSearch();
    });
  }


  cancelAppointment(id: any): void{
    console.log(id);
    console.log(new Date(id));
  }


}
