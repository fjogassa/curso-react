import React from 'react';
import PropTypes from 'prop-types';
import {ListGroup} from 'react-bootstrap';
import User from './User';

const UserList = props => {
  console.log(props.users);
  return (
    <ListGroup style={{flexBasis: '100%', marginTop: 10, flexDirection:'row', overflowY: 'scroll'}} >
      {props.users.map(user => (
        <User key={user.uid} user={user}/>
      ))}
    </ListGroup>
  );
};

UserList.defaultProps = {
  users: []
}

UserList.propTypes = {
  users: PropTypes.array
};

export default UserList;