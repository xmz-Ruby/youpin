import React from 'react'

import { connect } from 'react-redux'

import '../../common/Product.css'
import iceboxImg from '../../../images/tv.jpg'
import {Modal,Button,Popover,Tooltip,FormControl,FormGroup} from 'react-bootstrap';

import $ from 'jquery'

import web3 from '../../../web3';
import youpin from '../../../youpin';


class productLists extends React.Component{
    constructor(){
        super();

        this.state = {
            joinString:"",
            waitData:"正在加载...",
            joinstatestring:"已参与",
            My_pro_arr:'',
            joinState:{display: "none"},
            haveJoinState:{display: "none"},
            quitState:{display: "none"},
            receipt:{display:"none"},
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
            divNoFloatStyle:{position: "relative", top: "20px"},
            name:"",
            address:"",
            phone:""
        }
    }
    onNameInputChange(e) {
        this.setState({ name: e.target.value } );
    }
    onAddressInputChange(e) {
        this.setState({ address: e.target.value } );
    }
    onPhoneInputChange(e) {
        this.setState({ phone: e.target.value } );
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
        console.log(this.state.idx_pro_info[5] ==='ForLottery');
        if (isInGroup>0 && this.state.idx_pro_info[5]==='Join' ) {
            this.setState({joinState:{display: "none"}});
            this.setState({haveJoinState:{display: "none"}});
            this.setState({quitState:{display: ""}});
            this.setState({receipt:{display:"none"}});
        
        }
        else if(this.state.idx_pro_info[5]==='Complete the Receipt information' && this.state.idx_pro_info[7]===accounts[0]){
            this.setState({joinState:{display: "none"}});
            this.setState({haveJoinState:{display: "none"}});
            this.setState({quitState:{display: "none"}});
            this.setState({receipt:{display:""}});
        } 
        else if(this.state.idx_pro_info[5] ==='ForLottery') {
            this.setState({joinState:{display: ""},joinString:"点击开奖"});
            this.setState({haveJoinState:{display: "none"}});
            this.setState({quitState:{display: "none"}});
            this.setState({receipt:{display:"none"}});
        }
        else if(this.state.idx_pro_info[5]==='Awaiting Shipment' && this.state.idx_pro_info[7]===accounts[0]){
            this.setState({joinState:{display: "none"}});
            this.setState({haveJoinState:{display: ""},joinstatestring:"等待发货..."});
            this.setState({quitState:{display: "none"}});
            this.setState({receipt:{display:"none"}});
        }
        else if(this.state.idx_pro_info[5]==='Confirmation of receipt' && this.state.idx_pro_info[7] === accounts[0]){
            this.setState({joinState:{display: ""},joinString:"点击确认收货"});
            this.setState({haveJoinState:{display: "none"}});
            this.setState({quitState:{display: "none"}});
            this.setState({receipt:{display:"none"}});
        }
        else if(this.state.idx_pro_info[5]==='Finish!~Congratulations!!!' && this.state.idx_pro_info[7] === accounts[0]){
            this.setState({joinState:{display: "none"}});
            this.setState({haveJoinState:{display: ""},joinstatestring:"奖品已收到！"});
            this.setState({quitState:{display: "none"}});
            this.setState({receipt:{display:"none"}});
        }
        else if(this.state.idx_pro_info[5]==='Destroyed.'){
            this.setState({joinState:{display: "none"}});
            this.setState({haveJoinState:{display: ""},joinstatestring:"该拼团已撤销！参团费用已退还。"});
            this.setState({quitState:{display: "none"}});
            this.setState({receipt:{display:"none"}});
        }
        else{
            this.setState({joinState:{display: "none"}});
            this.setState({haveJoinState:{display: ""},joinstatestring:"已参与，未中奖！"});
            this.setState({quitState:{display: "none"}});
            this.setState({receipt:{display:"none"}});
        }
    }
    onSubmitChild= async event =>{
        const accounts = await web3.eth.getAccounts();
        this.setState({message:'waiting on transation success'});
        if (this.state.idx_pro_info[5] ==='ForLottery'){
            await youpin.methods.lottery(this.state.groupId).send({from:accounts[0]});
            const idx_pro_info = await youpin.methods.getGroupOutline(this.state.groupId).call();
            this.state.groupDetails[this.state.idx] = idx_pro_info;
            this.setState({
               groupDetails:this.state.groupDetails
            });
            this.setState({message:"Congratulate"+idx_pro_info[7]});
        }
        else if(this.state.idx_pro_info[5]==='Confirmation of receipt'){
            await youpin.methods.confirm(this.state.groupId).send({from:accounts[0]});
            const idx_pro_info = await youpin.methods.getGroupOutline(this.state.groupId).call();
            this.state.groupDetails[this.state.idx] = idx_pro_info;
            this.setState({
               groupDetails:this.state.groupDetails
            });
            this.setState({message:"确认收货成功",joinState:{display:"none"}});

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
    //生命周期:挂载成功后给state赋值
    async componentDidMount(){
        const accounts = await web3.eth.getAccounts();
        const groups = await youpin.methods.getPlayerGroupMap().call({from:accounts[0]});
    // const balance = await web3.eth.getBalance(youpin.options.address);
    console.log(groups.length);
    if(groups.length === 0){
        this.setState({waitData:"没有获取到数据。"});
    }
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

        let Add_pro_arr = this.props.Add_pro_arr ? this.props.Add_pro_arr : ''
        // console.log(Add_pro_arr)
        this.setState({
            My_pro_arr:Add_pro_arr
        })
    }

    close() {
        this.setState({ showModal: false });
    }
    
    open() {
        this.setState({ showModal: true });
    }

    //删除产品函数
    deleteAddPro(e){
        let idx = e.target.getAttribute('data-idx');
        // console.log(idx);
        // 删除点击的产品 并重新渲染DOM
        this.state.My_pro_arr.splice(idx,1);
        console.log(this.state.My_pro_arr);
        //更新状态
            //疑问,因为setState属于异步操作,所以DOM更新的时候My_pro_arr还未更新,导致jugleContent的判断失误
        this.setState({
            My_pro_arr:this.state.My_pro_arr
        },function(){
            console.log('setState更新成功')
            this.jugleContent()
        })
    }

    onSubmitAddress= async event =>{
        const accounts = await web3.eth.getAccounts();
        this.setState({message:'waiting on transation success'});  

        await youpin.methods.completeReceipt(this.state.groupId,this.state.name,this.state.address,this.state.phone).send({from:accounts[0]});
        
        this.setState({message:'Submit success.'});
        const idx_pro_info = await youpin.methods.getGroupOutline(this.state.groupId).call();
        this.state.groupDetails[this.state.idx] = idx_pro_info;
        this.setState({
            groupDetails:this.state.groupDetails
        });

        this.setState({ showModal: false });
        //隐藏
        $('#myModal').modal('hide')
        this.setState({message:''});
        
    }

    jugleContent(){

        //如果内容不为空,则循环数据
        if( this.state.groupDetails.length>0 ){
            return(
                 <ul>
                    {/*循环接收到的数据:this.props*/}
                    {
                        this.state.groupDetails.map((item,i) => 
                        <li key={i} className="productLi right_li">
                        <img alt="" src={"http://localhost:8080/ipfs/" + item[8]} className="productImg" /> 
                        <div className="productCont">
                        <div className="contLeft" style={{position:"relative",top:"20px",width:"100%"}}>
                            <p className="pro_name">{item[0]}</p>
        <span className="pro_desc" style={this.state.spanStyle}  title={item[1]}>{this.state.chiefDetails[i][2]}</span>
                        </div>

                            <div className="contRight" >
                                <button className="btn btn-info btn-margin">总价值￥{web3.utils.fromWei(item[2],'ether')}ETH</button>                    
            <button className="btn btn-info btn-margin">参与人次:{item[4]}/{item[3]}</button>
                            </div>
                            
                            <div style={{clear:'both'}}></div>
                        </div>
                        <div style ={this.state.divNoFloatStyle} align="center">
                                <button className="btn btn-danger" data-idx={i} data-toggle="modal" data-target="#myModal" onClick={this.addProInModal.bind(this)}>查看详情</button>
                            </div>
                    </li>)
                    }
                    {/*bootstrap弹框样式*/}
                <div className="modal fade" id="myModal"  role="dialog" aria-labelledby="myModalLabel">
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
                                            <p className="pro_name">{this.state.idx_pro_info[0]}</p>
                                            <span className="pro_desc" style={this.state.spanStyle} title={this.state.idx_pro_info[1]}>{this.state.idx_pro_info_detail[2]}</span>
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
                                    <div className="productCont3" style={this.state.groupdetailstyle}>
                                        <div className="contLeft" >
                                            <p className="pro_name" >中奖用户</p>
                                            <span className="pro_desc2"  title={this.state.idx_pro_info[7]}>{this.state.idx_pro_info[7]}</span>
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
                                    <Button  onClick={this.open.bind(this)} style={this.state.receipt}>恭喜中奖，点击填写收货信息</Button> 
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div>
        
 
        
        <Modal show={this.state.showModal} onHide={this.close.bind(this)}>
          <Modal.Header closeButton>
            <Modal.Title>填写收货信息</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form role="form" id="address_form">
	<div class="form-group" style={{align:"center"}}>
		<label for="name">您的名称</label>
		<input type="text" class="form-control" id="name" 
			   placeholder="请输入名称" value={this.state.name} onChange={this.onNameInputChange.bind(this)} required/>
	</div>
    <div class="form-group">
		<label for="name">您的联系方式</label>
		<input type="text" class="form-control" id="phone" 
			   placeholder="请输入手机号" value={this.state.phone} onChange={this.onPhoneInputChange.bind(this)} required/>
	</div>
    <div class="form-group">
		<label for="name">您的收货地址</label>
		<input type="text" class="form-control" id="address" 
			   placeholder="请输入收货地址" value={this.state.address} onChange={this.onAddressInputChange.bind(this)} required/>
	</div>
</form>

            <hr />

            
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.close.bind(this)}>取消</Button>
            <Button onClick={this.onSubmitAddress.bind(this)}>确认无误并提交</Button>
          </Modal.Footer>
        </Modal>
      </div>
                </ul>       
            )
        }
        else{
        return <div className="no_pro_arr">{this.state.waitData}</div>
        }
    }


    render(){
        // console.log(this.jugleContent())
        return(
           this.jugleContent()
        )
    }
}

//connect参数之一,获取参数 , state为接受的参数
const mapStateToProps = (state) => {
    console.log(state);
    return {
        Add_pro_arr:state.pro_Info
    }
}

productLists = connect(mapStateToProps)(productLists)

export default productLists;