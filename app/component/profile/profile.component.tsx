import React from 'react';
import {Text, View} from 'react-native';
import {User} from '../../interface/user.interface';
import {styles} from './profile.style';

interface Props {
  user: User;
}

export default class Profile extends React.Component<Props> {
  componentDidMount() {}

  render() {
    const {user} = this.props;
    return (
      <View style={styles.profileContainer}>
        <Text>{user.username}</Text>
      </View>
    );
  }
}
