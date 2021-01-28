import React from 'react';
import {Image, Text, View} from 'react-native';
import Localization from '../../localization/i18n/i18n.localization';
import CustomInput from '../custom-input/custom-input.component';
import {styles} from './profile.style';
import {faSignature} from '@fortawesome/free-solid-svg-icons';
import {User} from '../../interface/user.interface';
import {TouchableOpacity} from 'react-native-gesture-handler';
import CustomButton from '../custom-button/custom-button.component';
import axios, {CancelTokenSource} from 'axios';
import {UserController} from '../../contoller/user.controller';
import {LogSeverity} from '../../enum/log-severity.enum';
import {Logger} from '../../util/logger.util';

interface Props {
  user: User;
}

interface State {
  firstName: string;
  lastName: string;
  username: string;
  userImage: string;
}

export default class Profile extends React.Component<Props, State> {
  private _cancelTokenSource: CancelTokenSource;
  private _userController: UserController;

  constructor(props: Props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      username: '',
      userImage: '',
    };
    this._cancelTokenSource = axios.CancelToken.source();
    this._userController = new UserController();
  }

  componentDidMount = async () => {
    const {user} = this.props;
    if (user && user.payload && user.payload.firstName) {
      this.setState({firstName: user.payload.firstName});
    }

    if (user && user.payload && user.payload.lastName) {
      this.setState({lastName: user.payload.lastName});
    }

    if (user && user.username) {
      this.setState({username: user.username});
    }

    if (user && user.payload && user.payload.profileImageId) {
      //get profile image
      try {
        const res = await this._userController.getProfileImage(
          user.payload.profileImageId,
          this._cancelTokenSource.token,
        );

        if (
          res &&
          res.data &&
          res.data.file &&
          res.data.file.data &&
          res.status === 200
        ) {
          Logger.log({
            severity: LogSeverity.INFO,
            message: 'Response is taken for Profile Image.',
            callerInstance: this,
            callerMethod: 'componentDidMount',
          });
          this.setState({userImage: res.data.file.data});
        } else {
          Logger.log({
            severity: LogSeverity.MINOR,
            message: 'Broken Data.',
            callerInstance: this,
            callerMethod: 'componentDidMount',
          });
        }
      } catch (e) {
        Logger.log({
          severity: LogSeverity.MAJOR,
          message: 'Unhandled Exception: ',
          args: e,
          callerInstance: this,
          callerMethod: 'componentDidMount',
        });
      }
    }
  };

  render() {
    const {firstName, lastName, username, userImage} = this.state;

    return (
      <View style={styles.profileContainer}>
        <TouchableOpacity
          style={styles.profileImageContainer}
          onPress={() => {
            console.log('pressed');
          }}>
          <Image
            style={styles.profileImage}
            source={{uri: `data:image/png;base64,${userImage}`}}></Image>
        </TouchableOpacity>
        <View style={styles.textContainer}>
          <Text style={styles.username}>{username}</Text>
          <View style={styles.inputs}>
            <CustomInput
              placeholder={Localization.t('firstName')}
              validation={true}
              value={firstName}
              isEmail={false}
              onChangeText={(text: string) => this.setState({firstName: text})}
              icon={faSignature}
              isSecure={false}
              editable={true}
            />
            <CustomInput
              placeholder={Localization.t('lastName')}
              validation={true}
              value={lastName}
              isEmail={false}
              onChangeText={(text: string) => this.setState({lastName: text})}
              icon={faSignature}
              isSecure={false}
              editable={true}
            />
            <View style={styles.actions}>
              <CustomButton
                title="Save"
                onPress={() => console.log('pressed')}
                disabled={false}></CustomButton>
            </View>
          </View>
        </View>
        {/*
        <Text>{userChanged.payload.profileImageId}</Text> */}
      </View>
    );
  }
}
