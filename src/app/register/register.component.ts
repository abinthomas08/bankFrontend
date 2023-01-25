import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  //register form group 
  

  registerForm = this.fb.group({
    uname:['',[Validators.required,Validators.pattern('[a-zA-z]*')]],
    acno:['',[Validators.required,Validators.pattern('[0-9]*')]],
    pswd:['',[Validators.required,Validators.pattern('[0-9a-zA-Z]*')]],


  })

  constructor(private fb:FormBuilder,private api:ApiService,private router:Router){

  }

  register(){
    // console.log(this.loginForm.get('acno')?.errors);
    if(this.registerForm.valid){

        
      let acno= this.registerForm.value.acno
      let pswd=this.registerForm.value.pswd
      let uname=this.registerForm.value.uname
      this.api.register(uname,acno,pswd)
      .subscribe(
        //success
        (result:any)=>{
        alert(result.message)
        //navigate login
        this.router.navigateByUrl('')

      },
      (result:any)=>{
        alert(result.error.message)
      }
      )
        

    }
    else{
      alert('invalid Form ')
    }
  }


}
