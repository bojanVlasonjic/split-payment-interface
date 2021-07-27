package dipl.spi.spi_backend.service;

import dipl.spi.spi_backend.dto.AccountDto;
import dipl.spi.spi_backend.exception.ApiBadRequestException;
import dipl.spi.spi_backend.mappers.AccountMapper;
import dipl.spi.spi_backend.model.Account;
import dipl.spi.spi_backend.model.AppUser;
import dipl.spi.spi_backend.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AccountService {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private AppUserService userService;

    @Autowired
    private AccountMapper accountMapper;


    public List<AccountDto> getAccountsForUser(Long userId) {

        return accountRepository
                .findByCreatorId(userId)
                .stream()
                .map(ac -> accountMapper.accountToAccountDto(ac))
                .collect(Collectors.toList());
    }
    

    public AccountDto createAccount(AccountDto accountDto) {

        if(accountRepository.findByNumber(accountDto.getNumber()).isPresent()) {
            throw new ApiBadRequestException("Account number is already in use");
        }

        AppUser user = userService.findUserById(accountDto.getUserId());
        Account account = accountMapper.accountDtoToAccount(accountDto, user);

        accountRepository.save(account);
        return accountMapper.accountToAccountDto(account);
    }


    public Optional<Account> findAccountById(Long id) {

        if(id != null) {
            return accountRepository.findById(id);
        }

        return Optional.empty();

    }

}
