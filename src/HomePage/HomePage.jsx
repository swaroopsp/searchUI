import React, { Component } from "react";
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { userService } from '../_services';

import {
        ReactiveBase,
        DataSearch,
        MultiList,
        SelectedFilters,
        ReactiveList
} from '@appbaseio/reactivesearch';
import {
        Row,
        Button,
        Col,
        Card,
        Switch,
        Tree,
        Popover,
        Affix
} from 'antd';
// import 'antd/dist/antd.css';

function fetchUsers(token) {
  return fetch('http://localhost:3000/verify', {
      method: "POST",
      crossDomain:true,
      headers:{'Content-Type': 'application/json'},
      body: JSON.stringify({ token })
  })
  .then((resp) => {
      console.log(resp.status)
      if(resp.status != 200){
        throw error;
      }
      return resp.json();
  })
  .then((user) => {
    return user;              
})
}

function fetchURL(url) {
    console.log("asdfsdfsd" + url)
    return fetch('http://192.168.15.57:5000/files?pathToFile='+url, {
      method: "GET"
    })
    .then((resp) => {
      return resp.text();
    }) 
    .then((data) => {
        console.log("11111111111111" + data)   
        return data;              
    })
    .catch((error) => {
      console.log(error, "catch the hoop")
    })
  }

function getNestedValue(obj, path) {
        const keys = path.split('.');
        const currentObject = obj;
        const nestedValue = keys.reduce((value, key) => {
                if (value) {
                return value[key];
                }
                return '';
        }, currentObject);
        if (typeof nestedValue === 'object') {
                return JSON.stringify(nestedValue);
        }
        return nestedValue;
}

function renderItem(res, triggerClickAnalytics) {
        let { image, url, description, title } = {"title":"path.virtual","description":"content","image":"","url":"path.real"};
        image = getNestedValue(res,image);
        title = getNestedValue(res,title);
        url = getNestedValue(res,url);
        description = getNestedValue(res,description)
        return (
                <Row onClick={triggerClickAnalytics} type="flex" gutter={16} key={res._id} style={{margin:'20px auto',borderBottom:'1px solid #ededed'}}>
                        <Col span={image ? 6 : 0}>
                                {image &&  <img src={image} alt={title} /> }
                        </Col>
                        <Col span={image ? 18 : 24}>
                                <h3 style={{ fontWeight: '600' }} dangerouslySetInnerHTML={{__html: title || 'Choose a valid Title Field'}}/>
                                <p style={{ fontSize: '1em' }} dangerouslySetInnerHTML={{__html: description || 'Choose a valid Description Field'}}/>
                        </Col>
                        <div style={{padding:'20px'}}>
                                {url ? <Button shape="circle" icon="link" style={{ marginRight: '5px' }} onClick={() => {
                                            fetchURL(url).then(fullPath=> window.open(fullPath))
                                        }
                                    } />: null}
                        </div>
                </Row>
        );
};


const { ResultCardsWrapper } = ReactiveList;

class HomePage extends Component {
    constructor(props) {
        super(props);

        this.state = {
          user: {}
        };
    }
    componentDidMount() {
      fetchUsers(localStorage.getItem('token'))
      .then(user=> 
        
        this.setState({ 
          user: user
          
      }))
      .catch((error) => {
        console.log(error, "There is some issue")
        this.props.history.push('/login')
      })
        
    }
  render() {
    const { user } = this.state;
    return (
        <ReactiveBase
                app="fcaindex"
                credentials="null"
                url="http://192.168.15.57:9200"
                analytics={true}
                searchStateHeader>
                <div>
                    <h1>Hi {user.firstName}!</h1>
                    <p>
                    <Link to="/login">Logout</Link>
                    </p>
                </div>
                <Row gutter={16} style={{ padding: 20 }}>
                        <Col span={12}>
                                <Card>
                                <MultiList
                                  componentId="list-3"
                                  dataField="meta.raw.Author.keyword"
                                  size={100}
                                  style={{
                                    marginBottom: 20
                                  }}
                                  title="Author"
                                />
                                <MultiList
                                  componentId="list-2"
                                  dataField="file.extension.keyword"
                                  size={100}
                                  style={{
                                    marginBottom: 20
                                  }}
                                  title="Type"
                                />
                                </Card>
                        </Col>
                        <Col span={12}>
                                <DataSearch
                                  componentId="search"
                                  dataField={[
                                    'file.filename',
                                    'file.filename.keyword',
                                    'content',
                                    'content.keyword',
                                    'meta.author',
                                    'meta.author.keyword'
                                  ]}
                                  fieldWeights={[
                                    1,
                                    1,
                                    1,
                                    1,
                                    1,
                                    1
                                  ]}
                                  fuzziness={"AUTO"}
                                  highlight={true}
                                  highlightField={[
                                    'file.filename',
                                    'content',
                                    'meta.author'
                                  ]}
                                  style={{
                                    marginBottom: 20
                                  }}
                                />

                                <SelectedFilters />
                                <div id="result">
                                        <ReactiveList
                                  componentId="result"
                                  dataField="_score"
                                  pagination={true}
                                  react={{
                                    and: [
                                      'search',
                                      'list-3',
                                      'list-2'
                                    ]
                                  }}
                                  renderItem={renderItem}
                                  size={10}
                                  style={{
                                    marginTop: 20
                                  }}
                                />
                                </div>
                        </Col>

                </Row>
        </ReactiveBase>
    );
  }
}

export { HomePage };