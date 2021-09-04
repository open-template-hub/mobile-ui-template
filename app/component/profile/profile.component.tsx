import React from 'react';
import {Alert, Image, Text, View} from 'react-native';
import Localization from '../../localization/i18n/Localization';
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
import {
  ImageLibraryOptions,
  ImagePickerResponse,
  launchImageLibrary,
} from 'react-native-image-picker';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faImage} from '@fortawesome/free-regular-svg-icons';
import Loading from '../loading/loading.component';
import {UserPayload} from '../../interface/user-payload.interface';
import {Storage} from '../../app.store';
import {ToastUtil} from '../../util/toast.util';

interface Props {
  user: User;
}

interface State {
  firstName: string;
  lastName: string;
  username: string;
  userImage: string;
  userImageChanged: boolean;
  loading: boolean;
  contentType: string;
  profileImageId: number;
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
      userImageChanged: false,
      loading: false,
      contentType: 'image/png',
      profileImageId: -1,
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
          this.setState({
            userImage: res.data.file.data,
            contentType: res.data.file.content_type,
            profileImageId: user.payload.profileImageId,
          });
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

  addImage = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: true,
      maxWidth: 600,
      maxHeight: 600,
    } as ImageLibraryOptions;

    launchImageLibrary(options, (response: ImagePickerResponse) => {
      if (response.didCancel) {
        Logger.log({
          severity: LogSeverity.INFO,
          message: 'User cancelled image picker.',
          callerInstance: this,
          callerMethod: 'addImage',
        });
      } else if (response.errorCode) {
        Logger.log({
          severity: LogSeverity.INFO,
          message: 'ImagePicker Error: ',
          args: response.errorCode,
          callerInstance: this,
          callerMethod: 'addImage',
        });
      } else {
        Logger.log({
          severity: LogSeverity.INFO,
          message: 'Profile image updated.',
          callerInstance: this,
          callerMethod: 'addImage',
        });
        this.setState({
          userImage: response.base64 as string,
          userImageChanged: true,
          contentType: response.type as string,
        });
      }
    });
  };

  saveProfile = async () => {
    this.setState({loading: true});

    try {
      const {
        firstName,
        lastName,
        userImage,
        contentType,
        username,
        userImageChanged,
        profileImageId,
      } = this.state;
      const auth = await Storage.getAuth();

      if (auth && auth.accessToken) {
        var imageId = -1;

        if (userImageChanged) {
          imageId = await this._userController.saveProfileImage(
            auth,
            userImage,
            contentType,
            username,
          );
          console.log('Image res: ', imageId);
        }

        const payload = {
          firstName,
          lastName,
          profileImageId: imageId === -1 ? profileImageId : imageId,
        } as UserPayload;

        await this._userController.updateMe(auth, payload);

        ToastUtil.show(Localization.t('successfullySaved'));
      }
    } catch (e) {
      Logger.log({
        severity: LogSeverity.MAJOR,
        message: 'Unhandled Exception: ',
        args: e,
        callerInstance: this,
        callerMethod: 'saveProfile',
      });
      Alert.alert(Localization.t('saveErrorLabel'), e.message);
    } finally {
      this.setState({
        loading: false,
        userImageChanged: false,
      });
    }
  };

  render() {
    const {
      firstName,
      lastName,
      username,
      userImage,
      contentType,
      loading,
    } = this.state;
    return (
      <View style={styles.profileContainer}>
        <TouchableOpacity
          style={styles.profileImageContainer}
          disabled={loading}
          onPress={() => {
            this.addImage();
          }}>
          {userImage ? (
            <Image
              style={styles.profileImage}
              source={{uri: `data:${contentType};base64,${userImage}`}}></Image>
          ) : (
            <View style={styles.emptyProfileImage}>
              <FontAwesomeIcon icon={faImage} size={40} color="#212121" />
            </View>
          )}
        </TouchableOpacity>
        {loading ? <Loading></Loading> : null}
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
              editable={!loading}
            />
            <CustomInput
              placeholder={Localization.t('lastName')}
              validation={true}
              value={lastName}
              isEmail={false}
              onChangeText={(text: string) => this.setState({lastName: text})}
              icon={faSignature}
              isSecure={false}
              editable={!loading}
            />
            <View style={styles.actions}>
              <CustomButton
                title={Localization.t('save')}
                onPress={() => this.saveProfile()}
                disabled={loading}></CustomButton>
            </View>
          </View>
        </View>
      </View>
    );
  }
}
