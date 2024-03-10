import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SpinnerService } from 'src/app/shared/spinner/spinner.service';
import { AdminService } from '../services/admin.service';
import { MessagesService } from 'src/app/shared/messages/messages.service';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StaticDataService } from 'src/app/services/static.service';

@Component({
  selector: 'app-admin-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class CompanyUsersComponent implements OnInit, OnDestroy {
  subscriptions : Subscription[] = []
  users : any[] = []
  users_to_show : any[] = []
  company : any = null
  users_popup : boolean = false;
  actions_popup : boolean = false;
  connect_footengineers_popup : boolean = false;
  selected_user : any = null;
  isLoading : boolean = false;
  addUserForm: FormGroup;
  linkToLastengineersForm: FormGroup;
  searchText: string =  "";
  constructor(public AdminService:AdminService,
     private SpinnerService:SpinnerService,
     private StaticDataService:StaticDataService,
     private MessagesService:MessagesService,
     private route: ActivatedRoute){
  }
  ngOnInit(): void {
    this.SpinnerService.show()
     this.subscriptions.push(this.route.params.subscribe(params => {
      this.subscriptions.push(this.AdminService.getCompanyUsers(params['ref']).subscribe((data :any)=>{
          this.users = data.users;
          this.users_to_show = [...this.users]
          this.searchText = ""
          this.company = data.company;
          this.SpinnerService.hide()
        }, (error)=>{
          this.users = []
          this.users_to_show = []
          this.searchText = ""
          this.company = null;
          this.SpinnerService.hide()
      }))
   }));

    this.addUserForm = new FormGroup({
      ref: new FormControl({value: "", disabled: true}, Validators.required),
      first_name: new FormControl(null, Validators.required),
      last_name: new FormControl(null, Validators.required),
      email: new FormControl(null, Validators.required),
      role: new FormControl(null, Validators.required),
      system_size: new FormControl(null, Validators.required),
      country: new FormControl(null, Validators.required),
      city: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required)
    });
    this.linkToLastengineersForm = new FormGroup({
      email: new FormControl(null, Validators.required),
      token: new FormControl(null, Validators.required),
      platform: new FormControl('test', Validators.required)
    });
  }
  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe()
    }
  }

  cancel(){
    this.users_popup = false;
    this.actions_popup = false;
    this.selected_user = null
    this.addUserForm.reset()
    this.connect_footengineers_popup = false;
  }
  showAddUser(){
    this.users_popup = true;
  }
  showActions(user:any){
    this.actions_popup = true;
    this.selected_user = user;
  }
  showInfos(user:any){
    this.users_popup = true;
    this.selected_user = user;
    this.addUserForm.patchValue({
      ref: user.ref,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.user_role['slug'],
      country: user.country['slug'],
      city: user.city,
      system_size: user.system_size_slug['slug'],
    });
  }
  onSubmitUser(){
    if(this.selected_user) {
      this.onEditUser()
    } else {
      if(this.addUserForm.valid){
        this.isLoading = true;
        let data = {
          ...this.addUserForm.value,
          company: this.company.ref
        }
        this.subscriptions.push(this.AdminService.postNewUser(data).subscribe({
          next : (value) => {
              this.isLoading = false;
              this.cancel();
              this.ngOnInit()
            },
            error : (err) => {
              this.isLoading = false;
          },
        }))
      }
    }
  }

  onEditUser() {
    this.isLoading = true;
    let data = {
      ...this.addUserForm.value,
      company: this.company.ref
    }
    this.subscriptions.push(this.AdminService.updateUser(this.addUserForm.get('ref')?.value, data).subscribe({
      next : (value) => {
          this.isLoading = false;
          this.cancel();
          this.MessagesService.set("User Info updated Successfully")
          this.ngOnInit()
        },
        error : (err) => {
          // console.log(err)
          this.isLoading = false;
      },
    }))
  }

  select_contry($event: any) {
    this.addUserForm.controls['country'].setValue($event);
  }
  select_role($event: any) {
    this.addUserForm.controls['role'].setValue($event);
  }
  select_system_size($event: any) {
    this.addUserForm.controls['system_size'].setValue($event);
  }
  showLinkToLastEngineers(){
    this.connect_footengineers_popup = true
  }
  linkToLastEngineers(){
    if(this.linkToLastengineersForm.valid){
      this.isLoading = true;
      let data = {
        ...this.linkToLastengineersForm.value,
        email_footengineers: this.selected_user.email
      }
      this.subscriptions.push(this.AdminService.postLinkToLastengineers(data).subscribe({
        next : (response : any) => {
            this.isLoading = false;
            this.MessagesService.set(response.message, 'green');
            setTimeout(()=>{
              this.cancel();
              this.ngOnInit();
            }, 3000)
          },
          error : (err) => {
            this.isLoading = false;
        },
      }))
    }
  }

  get countries() {
    return this.StaticDataService.countries
  }
  get roles() {
    return this.StaticDataService.roles
  }
  get system_sizes() {
    return this.StaticDataService.system_sizes
  }

  search(){
    if (this.searchText.trim() != ""){
      this.users_to_show = this.users.filter((user) => user.email.toLowerCase().includes(this.searchText.toLowerCase()));
    }else{
      this.users_to_show = [...this.users]
    }
  }

}