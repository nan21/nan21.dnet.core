package net.nan21.dnet.core.api.session;

public interface IChangePasswordService {

	public void changePassword(String userName, String newPassword, String oldPassword, Long clientId, String clientCode ) throws Exception;
}
