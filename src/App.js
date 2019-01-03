import React, { Component } from 'react';
import './App.css';
import {connect} from 'react-redux'
import properties$ from './mock';
import {setInfoData, setFavorite} from './actions'
import { Icon, Table, Input, Button } from 'antd';
import Highlighter from 'react-highlight-words';
import 'antd/lib/table/style/css'
import 'antd/lib/icon/style/css'
import 'antd/lib/input/style/css'
import 'antd/lib/button/style/css'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tableInfo: [],
      searchText: '',
      
    }
  }

  componentDidMount(){
    const {setInfoData} = this.props
    properties$.subscribe(data => {
      setInterval(() => setInfoData(data), 2000)
    })
  }

  componentDidUpdate() {
    if(this.state.tableInfo !== this.props.info) {
      this.setState({tableInfo: this.props.info})
    }
  }

  getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys, selectedKeys, confirm, clearFilters,
    }) => (
      <div className="custom-filter-dropdown">
        <Input
          ref={node => { this.searchInput = node; }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button
          onClick={() => this.handleReset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
      </div>
    ),
    filterIcon: filtered => <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: (text) => (
      <Highlighter
        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
        searchWords={[this.state.searchText]}
        autoEscape
        textToHighlight={text.toString()}
      />
    ),
  })

  handleSearch = (selectedKeys, confirm) => {
    confirm();
    this.setState({ searchText: selectedKeys[0] });
  }

  handleReset = (clearFilters) => {
    clearFilters();
    this.setState({ searchText: '' });
  }


  render() {
    const {tableInfo} = this.state
    
    const columns = [
      {
        title: 'ID',
        key: 'id',
        dataIndex: 'id',
        defaultSortOrder: 'ascend',
        sorter: (a, b) => (!a.favorite && !b.favorite) ? a.id - b.id : a.favorite ? -1 : 1,
        ...this.getColumnSearchProps('id')
      }, 
      {
        title: 'Address',
        key: 'address',
        dataIndex: 'address',
        defaultSortOrder: 'ascend',
        sorter: (a, b) => (!a.favorite && !b.favorite) ? a.address.length - b.address.length : a.favorite ? -1 : 1,
        ...this.getColumnSearchProps('address')
      }, 
      {
        title: 'Price',
        key: 'price',
        dataIndex: 'price',
        defaultSortOrder: 'ascend',
        sorter: (a, b) => (!a.favorite && !b.favorite) ? a.price - b.price : a.favorite ? -1 : 1,
      },
      {
        title: 'Last Update',
        key: 'lastUpdate',
        dataIndex: 'lastUpdate',
        defaultSortOrder: 'ascend',
        sorter: (a, b) => (!a.favorite && !b.favorite) ? a.lastUpdate - b.lastUpdate : a.favorite ? -1 : 1,
      },
      {
        title: 'Type',
        key: 'type',
        dataIndex: 'type',
        defaultSortOrder: 'ascend',
        sorter: (a, b) => (!a.favorite && !b.favorite) ? a.type.length - b.type.length : a.favorite ? -1 : 1,
        ...this.getColumnSearchProps('type')
      },
      {
        title: 'Is in favorite',
        key: 'favorite',
        dataIndex: 'favorite',
        defaultSortOrder: 'ascend',
        sorter: (a, b) => (a.favorite === b.favorite) ? 0 : a.favorite ? -1 : 1,
        render: (text, record) => (
          <Icon theme="filled" onClick={()=> this.props.setFavorite(record)} className={record.favorite ? 'favorite-red' : 'favorite-gray'} type="heart" />
        )
      }
    ];
  
    return (
      <div className="app">
        <Table columns={columns} dataSource={tableInfo} />
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  info: state.info,
})

const mapDispatchToProps = dispatch => ({
  setInfoData: data => dispatch(setInfoData(data)),
  setFavorite: data => dispatch(setFavorite(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
