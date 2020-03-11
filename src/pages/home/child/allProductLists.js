import React from 'react';
import '../../common/Product.css';

import $ from 'jquery';
import  'bootstrap/dist/js/bootstrap' ;
import './modal.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import web3 from '../../../web3';
import youpin from '../../../youpin';

export default class ProductLists extends React.Component{
    constructor(...args){
        super(...args)
        
        this.state = {
            waitData:"正在加载...",
            joinString:"",
            joinState:{display: "none"},
            haveJoinState:{display: "none"},
            quitState:{display: "none"},
            showModal: false,
            
            clickIdx:0,
            pro_count:1, 
            idx:0,           
            idx_pro_info:[],
            idx_pro_info_detail:[],
            password:"0",
            warning_text:'',
            pro_price:0,
            groups:[],
            groupId:0,
            groupDetails:[],
            chiefDetails:[],
            divStyle:{
                position:"relative",
                top:"20px"
            },
            spanStyle:{
                wordBreak:"normal",
                width:"auto", 
                display:"block", 
                whiteSpace:"pre-wrap",
                wordWrap : "break-word" ,
                overflow: "hidden",
                position: "relative",
                top:"-20px" 
            },
            groupdetailstyle:{
                height:"100px",
                width:"100%"
            },
            groupDetailsspanstyle:{
                wordBreak:"normal",
                width:"auto", 
                display:"block", 
                whiteSpace:"pre-wrap",
                position: "relative",
                top:"-20px" 
            }
        }    
    } 


    //给模态框添加相应的产品信息
    addProInModal(e){
        let idx = e.target.getAttribute('data-idx');
        // console.log(this.state.clickIdx)
        let idx_pro_info = this.state.groupDetails[idx];
        let idx_pro_info_detail = this.state.chiefDetails[idx];
        // console.log(idx_pro_info)
        this.setState({
            idx,
            groupId:this.state.groups[idx],
            idx_pro_info,
            joinString:idx_pro_info[5],
            idx_pro_info_detail,
            pro_price:web3.utils.fromWei(idx_pro_info[2],'ether'),
            pro_count:1,//每次打开模拟框初始化数量
        });
        this.renderIsInGroup(this.state.groups[idx]);
    }
    async componentDidMount(){
         //onst manager = await lottery.methods.manager().call();
        const groups = await youpin.methods.getGroupArr().call();
        if(groups.length === 0){
            this.setState({waitData:"没有获取到数据。"});
        }else{
            
            this.setState({waitData:""});
        }
         // const balance = await web3.eth.getBalance(youpin.options.address);
        console.log(groups.length);
        const groupDetails = [];
        const chiefDetails = [];
        // _group.prizeName,_group.chiefWalletAddr,_group.prizeValue,_group.expectedPlayerNumber,_group.playerWalletAddrArr.length,state[_group.state],_group.ispassword,_group.prizewinnerWalletAddr
        for(let i=0;i<groups.length;i++){
            console.log(groups[0]);
            const _group= await youpin.methods.getGroupOutline(groups[i]).call();
            for(let key in _group){
                console.log(key + '---' + _group[key])
            } 
            const _chiefDetail = await youpin.methods.getGroupDetail(groups[i]).call();
            for(let key in _chiefDetail){
                console.log(key + '---' + _chiefDetail[key])
            } 
            groupDetails.push(_group);
            chiefDetails.push(_chiefDetail);
        }
        this.setState({groups,groupDetails,chiefDetails});
    };

    onSubmitQuit = async event =>{
        const accounts = await web3.eth.getAccounts();
        this.setState({message:'waiting on transation success'});
        await youpin.methods.personalRefund(this.state.groupId).send({from:accounts[0]});
        
        this.setState({message:'you quit.'});
        const idx_pro_info = await youpin.methods.getGroupOutline(this.state.groupId).call();
        this.state.groupDetails[this.state.idx] = idx_pro_info;
        this.setState({
            groupDetails:this.state.groupDetails
        });

        //隐藏
        $('#myModal').modal('hide')
        this.setState({message:''});
        
    }

    //数据传回父级
    onSubmitChild= async event =>{
        const accounts = await web3.eth.getAccounts();
        this.setState({message:'waiting on transation success'});
        if (this.state.idx_pro_info[5]==='ForLottery'){
            await youpin.methods.lottery(this.state.groupId).send({from:accounts[0]});
            const idx_pro_info = await youpin.methods.getGroupOutline(this.state.groupId).call();
            this.state.groupDetails[this.state.idx] = idx_pro_info;
            this.setState({
               groupDetails:this.state.groupDetails
            });
            if(idx_pro_info[7]===accounts[0]){
                this.setState({message:"Congratulate"+idx_pro_info[7],joinState:{display:"none"},haveJoinState:{display: ""},joinstatestring:"恭喜您已中奖，请前往您中奖的团查看详情"});
            }else{
                this.setState({message:"Congratulate"+idx_pro_info[7],joinState:{display:"none"},haveJoinState:{display: ""},joinstatestring:"抱歉您没中奖，下次好运~"});
            }
            
        }
        else{
            if (this.state.password == null){
                this.state.password = "0";
            }
            await youpin.methods.joinGroup(this.state.groupId,this.state.password).send({from:accounts[0],value:web3.utils.toWei(String(this.state.pro_price/this.state.idx_pro_info[3]),'ether')});
         
            this.setState({message:'you have participated.'});
            const idx_pro_info = await youpin.methods.getGroupOutline(this.state.groupId).call();
            this.state.groupDetails[this.state.idx] = idx_pro_info;
            this.setState({
               groupDetails:this.state.groupDetails
            });

            //隐藏
            $('#myModal').modal('hide')
            this.setState({message:''});
        }
         
    }

    renderPassWord(){
        let passWord;
        if (this.state.idx_pro_info[6] && this.state.idx_pro_info[5]==="Join") {
            return (<input placeholder="please enter the password" onChange={ event=> {this.setState({password:event.target.value})}}></input>);
        }
        else{
             return ;
        }
    }
    
    

    async renderIsInGroup(idx){

        const accounts = await web3.eth.getAccounts();
        const isInGroup = await youpin.methods.isInGroup(idx).call({from:accounts[0]});
        console.log(isInGroup);
        if (isInGroup>0 && this.state.idx_pro_info[4]<this.state.idx_pro_info[3] ) {

            this.setState({joinState:{display: "none"}});
            this.setState({haveJoinState:{display: "none"}});
            this.setState({quitState:{display: ""}});
        
        } 
        else if(isInGroup>0 && this.state.idx_pro_info[4]>=this.state.idx_pro_info[3] && this.state.idx_pro_info[5]=='Join') {
            this.setState({haveJoinState:{display: ""}});
            this.setState({joinState:{display: "none"}});
            this.setState({quitState:{display: "none"}});
        }
        else if(this.state.idx_pro_info[5] =='ForLottery') {
            this.setState({joinState:{display: ""},joinString:"点击开奖"});
            this.setState({haveJoinState:{display: "none"}});
            this.setState({quitState:{display: "none"}});
        }
        else if(this.state.idx_pro_info[5]==='Complete the Receipt information' && this.state.idx_pro_info[7]===accounts[0]){
            this.setState({joinState:{display: "none"}});
            this.setState({haveJoinState:{display: ""},joinstatestring:"恭喜您已中奖，请前往您中奖的团查看详情"});
            this.setState({quitState:{display: "none"}});
        } 
        else if(this.state.idx_pro_info[5]==='Join' && isInGroup==0 ){
            this.setState({haveJoinState:{display: "none"}});
            this.setState({joinState:{display: ""},joinString:"点击参与"});
            this.setState({quitState:{display: "none"}});
        }
        else{
            this.setState({haveJoinState:{display: "none"}});
            this.setState({joinState:{display: ""},joinString:"已参与，未中奖"});
            this.setState({quitState:{display: "none"}});
        }
    }

    render(){


        let Products = this.state.groupDetails;
        return(
            <ul >
            {this.state.waitData}
                {
                    Products.map((item,i) =>
                        <li key={this.state.groups[i]} className="productLi right_li">
                            <img alt="" src={"http://localhost:8080/ipfs/" + item[8]} className="productImg" /> 
                            <div className="productCont" style={this.state.divStyle}>
                                <div className="contLeft" style={{position:"relative",top:"20px",width:"100%"}}>
                                    <p className="pro_name">{item[0]}</p>
                <span className="pro_desc" style={this.state.spanStyle}  title={item[1]}>{this.state.chiefDetails[i][2]}</span>
                                </div>

                                <div className="contRight" style={this.state.divStyle}>
                                    <p className="price">￥{web3.utils.fromWei(item[2],'ether')}ETH</p>
                                    <button className="btn btn-danger" data-idx={i} data-toggle="modal" data-target="#myModal" onClick={this.addProInModal.bind(this)}>查看详情</button>
                                </div>
                                <div style={{clear:'both'}}></div>
                            </div>
                        </li>
                    )
                }

                {/*bootstrap弹框样式*/}
                <div className="modal fade" id="myModal" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel">
                    <form id="saveChangeForm">
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h6 className="modal-title" id="myModalLabel">查看(团号:{this.state.groupId})详情</h6>

                                </div>
                                <div className="modal-body">
                                    <img alt="" src={"http://localhost:8080/ipfs/" + this.state.idx_pro_info[8]} className="productImg" /> 
                                    <div className="productCont" >
                                        <div className="contLeft" >
                                            <p className="pro_name" style={{position: "relative", top:"-15px" }}>{this.state.idx_pro_info[0]}</p>
                                            <span className="pro_desc" style={this.state.spanStyle} title={this.state.idx_pro_info_detail[2]}>{this.state.idx_pro_info_detail[2]}</span>
                                        </div>

                                        <div className="contRight" style={this.state.divStyle}>
                                            <p className="price">参团费用￥{this.state.pro_price/this.state.idx_pro_info[3]}ETH</p>
                                            <p className="countBtn">
                                                <span className="count_warning">完成度</span>
                                                <span className="count">{this.state.idx_pro_info[4]}/{this.state.idx_pro_info[3]}</span>
                                            </p>
                                        </div>
                                        <div style={{clear:'both'}}></div>
                                    </div>
                                    <div className="productCont2" style={this.state.groupdetailstyle}>
                                        <div className="contLeft" >
                                            <p className="pro_name" style={{position: "relative", top:"-15px" }}>团长详情</p>
                                            <span className="pro_desc2" style={this.state.groupDetailsspanstyle} title={this.state.idx_pro_info_detail[0]}>团长联系方式：{this.state.idx_pro_info_detail[0]}</span>
                                            <span className="pro_desc2" style={this.state.groupDetailsspanstyle} title={this.state.idx_pro_info_detail[1]}>团长联系地址：{this.state.idx_pro_info_detail[1]}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer" >
                                    <span>{this.state.message}{}</span>
                                    
                                    <button type="button" className="btn btn-default" data-dismiss="modal">关闭</button>                    
                                    {  this.renderPassWord() }
                                    <button type="button" className="btn btn-primary"  onClick={this.onSubmitChild}  style={this.state.joinState}>{this.state.joinString}</button>
                <button type="button" className="btn btn-primary"  style={this.state.haveJoinState}>{this.state.joinstatestring}</button>
                                    <button type="button" className="btn btn-primary"  onClick={this.onSubmitQuit} style={this.state.quitState}>已参与点击退团</button>             
                                    
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                
            </ul>
        )

    }

}