package dipl.spi.spi_backend.mappers;

import dipl.spi.spi_backend.dto.AccountDto;
import dipl.spi.spi_backend.model.Account;
import dipl.spi.spi_backend.model.AppUser;
import org.springframework.stereotype.Component;


@Component
public class AccountMapper {

    public Account accountDtoToAccount(AccountDto accountDto, AppUser user) {

        Account account = new Account();

        account.setId(accountDto.getId());
        account.setNumber(accountDto.getNumber());
        account.setRecipientName(accountDto.getRecipientName());
        account.setRecipientAddress(accountDto.getRecipientAddress());

        if(user != null) {
            account.setCreator(user);
        }

        return account;
    }

    public AccountDto accountToAccountDto(Account account) {

        AccountDto accountDto = new AccountDto();
        accountDto.setId(account.getId());
        accountDto.setUserId(account.getCreator().getId());

        accountDto.setNumber(account.getNumber());
        accountDto.setRecipientName(account.getRecipientName());
        accountDto.setRecipientAddress(account.getRecipientAddress());

        return accountDto;
    }

}
