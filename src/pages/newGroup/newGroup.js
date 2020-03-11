import React from 'react'

import web3 from '../../web3';
import youpin from '../../youpin';

import ipfsAPI from 'ipfs-api/dist';
const ipfs = ipfsAPI({host: 'localhost', port: '5001', protocol: 'http'});

let saveImageOnIpfs = (reader) => {
  return new Promise(function(resolve, reject) {
    const buffer = Buffer.from(reader.result);
    ipfs.add(buffer).then((response) => {
      console.log(response)
      resolve(response[0].hash);
    }).catch((err) => {
      console.error(err)
      reject(err);
    })
  })
}

class newGroup extends React.Component{
   state = {
    prizeName:"",
    prizeValue:"0",
    playerNumber:"",
    password:"0",
    prizeImage:"",
    address:"",
    phoneNumber:"",
    details:""
  };

  onSubmit = async event =>{
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();
    this.setState({message:'waiting on transation success'});
    if (this.state.password == null){
        this.state.password = "0";
    }
    await youpin.methods.newGroup(this.state.prizeName,this.state.playerNumber,this.state.password,this.state.prizeImage,this.state.address,this.state.phoneNumber,this.state.details).send({from:accounts[0],value:web3.utils.toWei(this.state.prizeValue,'ether')});
    
    this.setState({message:'you have been created.'});
  };
    
    render(){
        web3.eth.getAccounts().then(console.log);
        return(
            <div className="newGroup">
    <hr/>
    <form onSubmit={ this.onSubmit}>
        <div align="center">
        <table border="10px" style={{width:"80%"}}>
            <tr>
                <td>
                    <h4 align="center"> Welcome~!! </h4>
                </td>
                <td/>
            </tr>
            <tr>
                <td width="40%" align="center"><label>奖品名称</label></td>
                <td ><input placeholder="填写奖品名称" style={{width:"100%"}} value={ this.state.prizeName} onChange={ event=> {this.setState({prizeName:event.target.value})}} required/>
                </td>
            </tr>
            <tr>
                <td align="center"><label> 奖品图片 </label>
                </td>
                <input type="file" ref="file" id="file" name="file" multiple="multiple" onChange={() => {
            var file = this.refs.file.files[0];
            var reader = new FileReader();
            // reader.readAsDataURL(file);
            reader.readAsArrayBuffer(file)
            reader.onloadend = (e) => {
              console.log(reader);
              saveImageOnIpfs(reader).then((hash) => {
                console.log(hash);
                this.setState({prizeImage: hash})
              });
            }}}/>
                <img  src={"http://localhost:8080/ipfs/" + this.state.prizeImage} height="150px" />
                
            </tr>
            <tr>
                <td align="center"> <label> 奖品价值 </label>
                </td>
                <input style={{width:"100%"}} value={ this.state.prizeValue} onChange={ event=> {this.setState({prizeValue:event.target.value})}} required/>
                
            </tr>
            <tr>
                <td align="center"> <label> 参与人数 </label>
                </td>
                <input placeholder="填写该团参与人数" style={{width:"100%"}} value={ this.state.playerNumber} onChange={ event=> {this.setState({playerNumber:event.target.value})}} required/>
                
            </tr>
            <tr>
                <td align="center"><label> 领奖联系地址 </label>
                </td>
                <input placeholder="填写领奖联系地址" style={{width:"100%"}} value={ this.state.address} onChange={ event=> {this.setState({address:event.target.value})}} required/>
                
            </tr>
            <tr>
                <td align="center">
                    <label> 领奖联系方式 </label>
                </td>
                <input placeholder="填写联系方式" style={{width:"100%"}} value={ this.state.phoneNumber} onChange={ event=> {this.setState({phoneNumber:event.target.value})}} required/>
                
            </tr>
            <tr>
                <td align="center"><label> 奖品简介 </label>
                </td>
                <input placeholder="填写奖品简介" style={{width:"100%"}} value={ this.state.details} onChange={ event=> {this.setState({details:event.target.value})}} required/>
                
            </tr>
            <tr>
                <td align="center"><label> 进团口令(纯数字，0表示无口令) </label>
                </td>
                <input placeholder="填写进团口令，无进团口令留空" style={{width:"100%"}} value={ this.state.password} onChange={ event=> {this.setState({password:event.target.value})}}/>
                
            </tr>
            <tr>
                <td><div> {this.state.message} </div></td>
                <td align="center"><button> 创建新的拼奖团 </button></td>
            </tr>
        </table>
        </div>
    </form>
</div>
        )
    }
}

export default newGroup