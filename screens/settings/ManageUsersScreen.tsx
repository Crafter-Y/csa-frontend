import { Text, TextInput, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/navigator/RootNavigator";
import { SettingsLayout } from "@/components/layouts/SettingsLayout";
import tw from "@/tailwind";
import useMediaQueries from "@/hooks/useMediaQueries";
import Input from "@/components/elements/Input";
import { Picker as RNPicker } from "@react-native-picker/picker";
import useCreateUser from "@/hooks/api/useCreateUser";
import Modal, { ModalHandle } from "@/components/elements/Modal";
import H2 from "@/components/elements/H2";
import SettingsForm from "@/components/SettingsForm";
import ErrorDisplay from "@/components/ErrorDisplay";
import Picker from "@/components/elements/Picker";
import Button from "@/components/elements/Button";
import Divider from "@/components/elements/Divider";
import TH from "@/components/elements/TH";
import useAllUsers from "@/hooks/api/useAllUsers";
import TR from "@/components/elements/TR";
import TD from "@/components/elements/TD";
import Form from "@/components/elements/Form";
import useAuthentication from "@/hooks/api/useAuthentication";
import { Image } from "expo-image";
import H1 from "@/components/elements/H1";
import useDeleteUser from "@/hooks/api/useDeleteUser";
import useRequestNewPassword from "@/hooks/api/useRequestNewPassword";

export type ManageUsersScreenProps = NativeStackNavigationProp<
  RootStackParamList,
  "ManageUsersScreen"
>;

const ManageUsersScreen = () => {
  const navigation = useNavigation<ManageUsersScreenProps>();

  const { isMd } = useMediaQueries();

  const { allUsers, queryUsers } = useAllUsers();

  const {
    createUser,
    hasCreationError,
    creationError,
    successfulUserCreation,
    userCreationResponse,
  } = useCreateUser();

  const { requestNewPassword, newPassword, successfulPasswordCreation } =
    useRequestNewPassword();

  const deleteUser = useDeleteUser();

  const [firstName, setFirstName] = useState("");
  const [secondName, setSecondName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("USER");

  const firstNameInput = useRef<TextInput>(null);
  const secondNameInput = useRef<TextInput>(null);
  const emailInput = useRef<TextInput>(null);

  const creationModal = useRef<ModalHandle>(null);
  const deleteUserModal = useRef<ModalHandle>(null);
  const requestNewPasswordModal = useRef<ModalHandle>(null);
  const newPasswordModal = useRef<ModalHandle>(null);

  const [userIdToDelete, setUserIdToDelete] = useState("");
  const [userNameToDelete, setUserNameToDelete] = useState("");

  const [userIdForNewPassword, setUserIdForNewPassword] = useState("");
  const [userNameForNewPassword, setUserNameForNewPassword] = useState("");

  const { user } = useAuthentication();

  useEffect(() => {
    if (successfulPasswordCreation) newPasswordModal.current?.toggleModal();
  }, [newPassword]);

  useEffect(() => {
    if (successfulUserCreation) {
      creationModal.current?.toggleModal();
      firstNameInput.current?.clear();
      secondNameInput.current?.clear();
      emailInput.current?.clear();
    }
  }, [successfulUserCreation]);

  return (
    <SettingsLayout navigation={navigation}>
      <H2
        style={tw.style(
          {
            "text-center": !isMd,
          },
          "mt-4"
        )}
      >
        Nutzer erstellen
      </H2>

      <SettingsForm>
        <Input
          placeholder="Vorname"
          onChangeText={(text) => setFirstName(text)}
          secureTextEntry={false}
          ref={firstNameInput}
          onSubmitEditing={() => secondNameInput.current?.focus()}
          returnKeyType="next"
        />
        <Input
          placeholder="Nachname"
          onChangeText={(text) => setSecondName(text)}
          secureTextEntry={false}
          onSubmitEditing={() => emailInput.current?.focus()}
          ref={secondNameInput}
          returnKeyType="next"
        />
        <Input
          placeholder="Email-Adresse"
          onChangeText={(text) => setEmail(text)}
          secureTextEntry={false}
          onSubmitEditing={() => emailInput.current?.blur()}
          ref={emailInput}
          returnKeyType="done"
          inputMode="email"
        />
        <Picker
          selectedValue={role}
          onValueChange={(itemValue) => setRole(itemValue)}
        >
          <RNPicker.Item label="User" value="USER" />
          <RNPicker.Item label="Moderator" value="MODERATOR" />
          <RNPicker.Item label="Admin" value="ADMIN" />
        </Picker>

        <ErrorDisplay hasError={hasCreationError} error={creationError} />

        <Button
          onPress={() =>
            createUser(firstName, secondName, email, role, navigation)
          }
        >
          Nutzer erstellen
        </Button>
      </SettingsForm>

      <Modal type="CENTER" ref={creationModal}>
        <Text
          style={tw`text-center text-2xl mt-6 px-4 font-semibold underline`}
        >
          Es wurde erfolgreich ein neuer Nutzer erstellt.
        </Text>
        <View style={tw`px-4 mt-4 gap-2`}>
          <Text>
            Rolle:{" "}
            {userCreationResponse?.role.charAt(0).toUpperCase() +
              "" +
              userCreationResponse?.role.slice(1).toLowerCase()}
          </Text>
          <Text style={tw`text-lg`}>
            {userCreationResponse?.firstname +
              " " +
              userCreationResponse?.lastname +
              " (" +
              userCreationResponse?.email +
              ")"}
          </Text>
          <Text style={tw`text-lg font-bold`}>
            {userCreationResponse?.password}
          </Text>
        </View>
        <View style={tw`items-center mb-4`}>
          <Button
            onPress={() => {
              queryUsers();
              creationModal.current?.toggleModal();
            }}
          >
            Fertig
          </Button>
        </View>
      </Modal>

      <Divider type="HORIZONTAL" style={tw`my-4`} />

      <SettingsForm style={tw`mb-8`}>
        <Form>
          <TH titles={["Mitglieder", ""]}></TH>
          {allUsers.map((Luser) => (
            <TR key={Luser.userId}>
              <TD>
                <Text style={tw`text-lg`}>
                  {Luser.firstname} {Luser.lastname}
                </Text>
                <Text>
                  {Luser.role.charAt(0).toUpperCase() +
                    "" +
                    Luser.role.slice(1).toLowerCase()}
                </Text>
                <Text>{Luser.email}</Text>
              </TD>
              <TD style={tw`justify-end flex-row items-center gap-1`}>
                {Luser.userId != "1" && Luser.userId != user?.userId && (
                  <Button
                    color="#f67e7e"
                    style={tw`p-1`}
                    onPress={() => {
                      setUserIdToDelete(Luser.userId);
                      setUserNameToDelete(
                        `${Luser.firstname} ${Luser.lastname}`
                      );
                      deleteUserModal.current?.toggleModal();
                    }}
                  >
                    <Image
                      source={require("@/assets/img/close.svg")}
                      style={{ height: 24, width: 24 }}
                    />
                  </Button>
                )}
                {Luser.userId != user?.userId && (
                  <Button
                    style={tw`p-1`}
                    onPress={() => {
                      setUserIdForNewPassword(Luser.userId);
                      setUserNameForNewPassword(
                        `${Luser.firstname} ${Luser.lastname}`
                      );
                      requestNewPasswordModal.current?.toggleModal();
                    }}
                  >
                    <Image
                      source={require("@/assets/img/refresh.svg")}
                      style={{ height: 24, width: 24 }}
                    />
                  </Button>
                )}
              </TD>
            </TR>
          ))}
        </Form>
      </SettingsForm>

      <Modal type="CENTER" ref={deleteUserModal}>
        <H1 style={tw`mt-2 text-center`}>Mitglied löschen?</H1>
        <Text style={tw`mx-4`}>
          Soll das Mitglied{" "}
          <Text style={tw`font-semibold`}>{userNameToDelete}</Text> wirklich
          glöscht werden?
        </Text>
        <View style={tw`justify-center flex-row gap-2 my-4`}>
          <Button
            onPress={() => {
              deleteUser(userIdToDelete);
              setTimeout(() => {
                queryUsers();
                deleteUserModal.current?.toggleModal();
                setTimeout(() => {
                  queryUsers();
                }, 200);
              }, 200);
            }}
            color="#f67e7e"
          >
            Löschen
          </Button>
          <Button onPress={() => deleteUserModal.current?.toggleModal()}>
            Abbrechen
          </Button>
        </View>
      </Modal>

      <Modal type="CENTER" ref={requestNewPasswordModal}>
        <H1 style={tw`mt-2 text-center`}>Passwort zurücksetzen?</H1>
        <Text style={tw`mx-4`}>
          Soll das Passwort von{" "}
          <Text style={tw`font-semibold`}>{userNameForNewPassword}</Text>{" "}
          wirklich zurückgesetzt werden?
        </Text>
        <View style={tw`justify-center flex-row gap-2 my-4`}>
          <Button
            onPress={() => {
              requestNewPassword(userIdForNewPassword);
              requestNewPasswordModal.current?.toggleModal();
            }}
            color="#f67e7e"
          >
            Zurücksetzen
          </Button>
          <Button
            onPress={() => requestNewPasswordModal.current?.toggleModal()}
          >
            Abbrechen
          </Button>
        </View>
      </Modal>

      <Modal type="CENTER" ref={newPasswordModal}>
        <H1 style={tw`mt-2 text-center`}>Neues Passwort generiert</H1>
        <Text style={tw`mx-4`}>
          Das Passwort von{" "}
          <Text style={tw`font-semibold`}>{userNameForNewPassword}</Text> wurde
          erfolgreich zurück gesetzt.
        </Text>
        <Text style={tw`mx-4 text-lg`}>
          Das neue Passwort lautet: {newPassword}
        </Text>
        <View style={tw`justify-center flex-row gap-2 my-4`}>
          <Button onPress={() => newPasswordModal.current?.toggleModal()}>
            Fertig
          </Button>
        </View>
      </Modal>
    </SettingsLayout>
  );
};

export default ManageUsersScreen;
