import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SpinnerService } from 'src/app/shared/spinner/spinner.service';
import { AdminService } from '../services/admin.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StaticDataService } from 'src/app/services/static.service';
import { MessagesService } from 'src/app/shared/messages/messages.service';

@Component({
  selector: 'app-admin-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class AdminCompanyComponent implements OnInit, OnDestroy {
  subscriptions : Subscription[] = []
  companies : any[] = []
  companies_to_show : any[] = []
  open_popup : boolean = false;
  isLoading : boolean = false;
  selected_company : any = null;
  addCompanyForm: FormGroup;
  selectedCompanyForm: FormGroup;
  searchText: string =  "";
  

  constructor(public AdminService:AdminService,
    public StaticDataService:StaticDataService,
    private messageService: MessagesService,
    private SpinnerService:SpinnerService){
  }
  ngOnInit(): void {
    this.addCompanyForm = new FormGroup({
      ref: new FormControl({value: null, disabled: true}, Validators.required),
      name: new FormControl(null, Validators.required),
      city: new FormControl(null, Validators.required),
      country: new FormControl(null, Validators.required),
      siret: new FormControl(null, Validators.required),
      tva: new FormControl(null, [Validators.required]),
      phone: new FormControl(null, [Validators.required, Validators.pattern('[- +()0-9]+')]),
      users_limit: new FormControl(1, [Validators.required, Validators.pattern('[0-9]+'), Validators.min(0)]),
      max_if: new FormControl(1, [Validators.required, Validators.pattern('[0-9]+'), Validators.min(0)]),
      max_af: new FormControl(1, [Validators.required, Validators.pattern('[0-9]+'), Validators.min(0)])
    });
    this.SpinnerService.show()
    this.subscriptions.push(this.AdminService.getAllCompanies().subscribe((data :any)=>{
        this.companies = data.companies;
        this.companies_to_show = [...this.companies]
        this.searchText = ""
        this.SpinnerService.hide()
      }, (error)=>{
        this.companies = []
        this.companies_to_show = []
        this.searchText = ""
        this.SpinnerService.hide()
    }))
  }
  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe()
    }
  }
  showAddCompany(){
    this.open_popup = true;
  }
  showInfos(company:any){
    this.open_popup = true;
    this.selected_company = company
    this.addCompanyForm.patchValue({
      ref: company.ref,
      name: company.name,
      city: company.city,
      country: company.country['slug'],
      siret: company.siret,
      tva: company.tva,
      phone: company.phone,
      users_limit: company.users_limit,
      max_if: company.max_if,
      max_af: company.max_af
    });
  }

  cancel(){
    this.open_popup = false;
    this.selected_company = null
    this.addCompanyForm.reset()
  }
  onSubmitCompany(){
    if(this.selected_company) {
      this.onEditCompany()
    } else {
      if(this.addCompanyForm.valid){
        this.isLoading = true
        // console.log(this.addCompanyForm.value)
        this.subscriptions.push(this.AdminService.postNewCompany(this.addCompanyForm.value).subscribe({
          next:(value) => {
            this.isLoading = false
            this.cancel();
            this.ngOnInit();
            },
            error:(err) => {
            this.isLoading = false
          },
        }))
      }
    }
  }

  onEditCompany() {
      this.isLoading = true
      this.subscriptions.push(this.AdminService.updateCompany(this.addCompanyForm.get('ref')?.value,this.addCompanyForm.value).subscribe({
        next:(value) => {
          this.isLoading = false
          this.cancel();
          this.messageService.set("Company Info updated Successfully")
          this.ngOnInit()
        },
        error:(err) => {
          console.log(err)
          this.isLoading = false
        }
      }))
  }

  select_contry($event: any) {
    this.addCompanyForm.controls['country'].setValue($event);
  }
  get countries() {
    return this.StaticDataService.countries
  }

  search(){
    if (this.searchText.trim() != ""){
      this.companies_to_show = this.companies.filter((company) => company.name.toLowerCase().includes(this.searchText.toLowerCase()));
    }else{
      this.companies_to_show = [...this.companies]
    }
  }

}