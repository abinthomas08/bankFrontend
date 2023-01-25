import { Component, OnInit } from '@angular/core';
import { FormBuilder ,Validators} from '@angular/forms';
import { ApiService } from '../services/api.service';
import party from "party-js";
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {


  logoutDiv:Boolean=false
  fundtransferSuccessMsg:String =''
  fundtransferErrorMsg:String =''

  user:string=''
  isCollapse:boolean=true
  currentAcno:Number=0
  balance:Number=0
  depositMsg:string=''

  acno:any='';

  deleteConfirm:boolean=false
  deleteSpinnerDiv:boolean=false

  depositeForm = this.fb.group({
    amount:['',[Validators.required,Validators.pattern('[0-9]*')]]

  })


  fundTransferForm= this.fb.group({
    toAcno:['',[Validators.required,Validators.pattern('[0-9]*')]],
    pswd:['',[Validators.required,Validators.pattern('[0-9a-zA-Z]*')]],
    amount:['',[Validators.required,Validators.pattern('[0-9]*')]]
  })




  constructor(private api:ApiService,private fb:FormBuilder, private router:Router ){

  }

  ngOnInit(){

    if(!localStorage.getItem("token")){
      alert("Please login")
      //navigate to login 
    this.router.navigateByUrl('/')

    }

    if(localStorage.getItem("username"))
    {
   this.user = localStorage.getItem("username") || ''
  }

  }


  collapse(){
    this.isCollapse= !this.isCollapse

  }
  getBalance(){
    if(localStorage.getItem("currentAcno")){
      this.currentAcno = JSON.parse(localStorage.getItem("currentAcno")|| '') 
      console.log(this.currentAcno);
      this.api.getBalance(this.currentAcno)
      .subscribe(
        (result:any)=>{
          console.log(result)
          this.balance=result.balance
        }
      )
     }

  }
  //deposite
  deposit(){
    if(this.depositeForm.valid){
      let amount =this.depositeForm.value.amount
      this.currentAcno = JSON.parse(localStorage.getItem("currentAcno")|| '') 
      this.api.deposit(this.currentAcno,amount)
      .subscribe(
        //success
        (result:any)=>{
          console.log(result)
          this.depositMsg=result.message
          setTimeout(() => {
            this.depositeForm.reset()
            this.depositMsg=''
          }, 5000);
        },
        (result:any)=>{
          this.depositMsg=result.error.message
        }
      )

    }
    else{
      alert('Invalid form')
    }
  }


  //show confetti

showconfetti(source:any){
  party.confetti(source);

}
//trasfer 
trasnfer(){

  if(this.fundTransferForm.valid){
    let toAcno = this.fundTransferForm.value.toAcno;
    let pswd = this.fundTransferForm.value.pswd;
    let amount = this.fundTransferForm.value.amount;
    
    //make api call for fund transfer 
    this.api.fundtransfer(toAcno,pswd,amount)
    .subscribe(
      //success 
      (result:any)=>{
        this.fundtransferSuccessMsg=result.message
        setTimeout(()=>{
          this.fundtransferSuccessMsg=''

        },3000)
      },
      //clienterror
      (result:any)=>{
        this.fundtransferErrorMsg=result.error.message
        setTimeout(()=>{
          this.fundtransferErrorMsg=''

        },3000)
      }
    )
    

  }
  else{
    alert('Invalid form');
  }
  
  

}

//cleareFundtransferForm
cleareFundTransferForm(){
  this.fundtransferSuccessMsg=""
  this.fundtransferErrorMsg =""
  this.fundTransferForm.reset()
}

//logout
logout(){
  localStorage.removeItem("token")
  localStorage.removeItem("username")
  localStorage.removeItem("currentAcno")


  this.logoutDiv=true
  setTimeout(() => {

    //navigate to login 
  this.router.navigateByUrl('/')
  this.logoutDiv=false
    
  }, 4000);

  
}


// deleteAccountFromNavBar

deleteAccountFromNavBar(){
  this.acno = localStorage.getItem("currentAcno")
  this.deleteConfirm=true
}


onCancel(){
  this.acno=""
  this.deleteConfirm = false

}

onDelete(event:any){

  let deleteAcno=JSON.parse(event)
  this.api.deleteAccount(deleteAcno)
  .subscribe(
    (result:any)=>{

      this.acno=""
      localStorage.removeItem("token")
      localStorage.removeItem("username")
      localStorage.removeItem("currentAcno")
      this.deleteSpinnerDiv = true

      setTimeout(() => {

        //navigate to login 
      this.router.navigateByUrl('/')
      this.deleteSpinnerDiv = false        
      }, 4000);


    },

    (result:any)=>{
      alert(result.error.message)
    }
   
  )

  
}



}


