import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

import jsPDF from 'jspdf'
import 'jspdf-autotable';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit{
  allTransactions:any;
  searchKey:string=''

  constructor(private api: ApiService,private router:Router){

  }


  ngOnInit(): void {


    if(!localStorage.getItem("token")){
      alert("Please login")
      //navigate to login 
    this.router.navigateByUrl('/')

    }



    this.api.getAllTransactions()
    .subscribe((result:any)=>{
     
      this.allTransactions = result.transaction
      console.log(this.allTransactions);
    })
      

   


  }

   //search
   search(event:any){
    this.searchKey = event.target.value

      
   }

   //generatepdf()
   generatePdf(){

    var pdf = new jsPDF()
    let col =['Type','FromAcno','ToAcno','Amount']
    let row:any = []

    pdf.setFontSize(16);
    pdf.text('Transaction History', 11, 8);
    pdf.setFontSize(12);
    pdf.setTextColor(99);

    // convert all Transaction to nested array 

    var itemNew = this.allTransactions
    

    for(let element of itemNew){

      var temp = [element.type,element.fromAcno,element.toAcno,element.amount];

      row.push(temp)
      
    }


    (pdf as any).autoTable(col,row,{startY:10})
    //Open pdf document in browswer's new tab
    pdf.output('dataurlnewwindow')

    // Download PDF doc  
    pdf.save('ministatement.pdf');




   }


}
